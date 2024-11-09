import { Icon } from "@iconify/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuid } from "uuid";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import ChatPlaceholder from "../../components/ChatPlaceholder";
import Spinner from "../../components/Spinner";
import TimeAgo from "../../components/TimeAgo";
import Heading from "../../components/layout/Heading";
import { queryKeys } from "../../constants/queryKeys";
import usePostQuery from "../../hooks/usePostQuery";
import { useUserSelector } from "../../hooks/useUserSelector";
import Modal from "../../components/shared/Modal";
import LocationMap from "../../components/chat/LocationMapBubble";
import { Skeleton } from "../../components/skeleton/Skeleton";
// const baseURL = process.env.REACT_APP_BASE_URL_ADMIN;

function Chat() {
  const chatMessagesContainerRef = useRef(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const { user } = useUserSelector();
  const [socket, setSocket] = useState(null);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [category, setCategory] = useState("Builder");
  const [activeChat, setActiveChat] = useState(null);
  const [showMedia, setShowMedia] = useState(false);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadPercentage, setUploadPercentage] = useState(0); // State for percentage
  const [video, setVideo] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);

  // Get Chats
  const { data, isLoading } = usePostQuery({
    queryKey: [queryKeys.Users],
    url: "/chat/users",
  });

  //process.env.REACT_APP_URL
  useEffect(() => {
    //wss://demo.api.nailed.biz
    const newSocket = io("https://demo.api.nailed.biz", {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("connected");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const uid = user.company_id;
  const { mutate } = useMutation({
    mutationKey: ["chats", uid, activeChat?._id],
    mutationFn: async (data) => {
      data.user1_id = uid;
      const res = await axios.post(
        `${process.env.REACT_APP_SOCKET_URL}/chat/messages`,
        data,
        {
          headers: {
            headers: {
              Authorization: `Bearer ${user?.auth_token}`,
              roleid: user?.role._id,
              "Content-Type": "application/json",
            },
          },
        },
      );
      return res.data;
    },
  });
  const chatMessages = useCallback(
    async (user_1, user_2) => {
      try {
        mutate(
          {
            user1_id: user_1,
            user2_id: user_2,
          },
          {
            onSuccess(data) {
              //console.log(data.message);
              setMessages(data.message);
            },
          },
        );
      } catch (error) {
        return error;
      }
    },
    [mutate],
  );

  const handleVideoSelect = (e) => {
    const selectedVideo = e.target.files[0];
    setVideo(selectedVideo);
    setPreviewVideo(URL.createObjectURL(selectedVideo));
  };

  const handleActiveChat = async (chat) => {
    setActiveChat(chat);
    await chatMessages(uid, chat?._id);
  };

  const sendVideo = async () => {
    const formData = new FormData();
    formData.append("chat_file", video);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SOCKET_URL}/send/chat/file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user?.auth_token}`,
            roleid: user?.role._id,
          },
          onUploadProgress: (progressEvent) => {
            const percentage = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadPercentage(percentage); // Update state with percentage
          },
          onDownloadProgress: (progressEvent) => {
            const percentage = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadPercentage(percentage); // Update state with percentage
          },
        },
      );

      const fileUrl = response.data.file_url;

      const date = new Date();
      const sentDate = date.toISOString().slice(0, -5) + "Z";

      if (activeChat.user_type === "Builder") {
        let message = {
          room: `${uid}-${activeChat._id}`,
          messageId: uuid(),
          senderId: user.user_type === "employee" ? user.company_id : user._id,
          displayName:
            user.user_type === "employee"
              ? `${user.f_name} ${user.l_name}`
              : user.company_name,
          sentDate: sentDate,
          message: fileUrl,
          hasImage: "false",
          user_type: activeChat.user_type,
          receiver_name: activeChat.name,
          receiver_id: activeChat._id,
          from: "Company",
          to: "Builder",
          message_kind: "video",
        };
        setMessages((prevMessages) => [...prevMessages, message]);
        // Here you can emit the message through socket.io if needed
        socket.emit("privateMessage", activeChat._id, message);
      } else {
        let message = {
          room: `${uid}-${activeChat._id}`,
          messageId: uuid(),
          senderId: user.user_type === "employee" ? user.company_id : user._id,
          displayName:
            user.user_type === "employee"
              ? `${user.f_name} ${user.l_name}`
              : user.company_name,
          sentDate: sentDate,
          message: fileUrl,
          hasImage: "false",
          user_type: activeChat.user_type,
          receiver_name: activeChat.name,
          receiver_id: activeChat._id,
          from: "Company",
          to: "Client",
          message_kind: "video",
        };
        setMessages((prevMessages) => [...prevMessages, message]);
        // Here you can emit the message through socket.io if needed
        socket.emit("privateMessage", activeChat._id, message);
      }
      setMsg("");
      setVideo(null);
      setPreviewVideo(null);
      setUploadPercentage(0);
    } catch (error) {
      console.error("Error sending video:", error);
      // Handle error
    }
  };

  const sendImage = async () => {
    // Create FormData object to send the image file

    const formData = new FormData();
    formData.append("chat_file", image);

    try {
      // Make a POST request to the endpoint with FormData
      const response = await axios.post(
        `${process.env.REACT_APP_SOCKET_URL}/send/chat/file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user?.auth_token}`,
            roleid: user?.role._id,
          },
          onUploadProgress: (progressEvent) => {
            const percentage = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadPercentage(percentage); // Update state with percentage
          },
        },
      );

      // Extract the file URL from the response data
      const fileUrl = response.data.file_url;

      const date = new Date();
      const sentDate = date.toISOString().slice(0, -5) + "Z";

      if (activeChat.user_type === "Builder") {
        let message = {
          room: `${uid}-${activeChat._id}`,
          messageId: uuid(),
          senderId: user.user_type === "employee" ? user.company_id : user._id,
          displayName:
            user.user_type === "employee"
              ? `${user.f_name} ${user.l_name}`
              : user.company_name,
          sentDate: sentDate,
          message: fileUrl,
          hasImage: "true",
          user_type: activeChat.user_type,
          receiver_name: activeChat.name,
          receiver_id: activeChat._id,
          from: "Company",
          to: "Builder",
          message_kind: "image",
        };
        setMessages((prevMessages) => [...prevMessages, message]);
        // Here you can emit the message through socket.io if needed
        socket.emit("privateMessage", activeChat._id, message);
      } else {
        let message = {
          room: `${uid}-${activeChat._id}`,
          messageId: uuid(),
          senderId: user.user_type === "employee" ? user.company_id : user._id,
          displayName:
            user.user_type === "employee"
              ? `${user.f_name} ${user.l_name}`
              : user.company_name,
          sentDate: sentDate,
          message: fileUrl,
          hasImage: "true",
          user_type: activeChat.user_type,
          receiver_name: activeChat.name,
          receiver_id: activeChat._id,
          from: "Company",
          to: "Client",
          message_kind: "image",
        };
        setMessages((prevMessages) => [...prevMessages, message]);
        // Here you can emit the message through socket.io if needed
        socket.emit("privateMessage", activeChat._id, message);
      }
      setMsg("");
      setImage(null);
      setPreviewImage(null);
      setUploadPercentage(0);
    } catch (error) {
      console.error("Error sending image:", error);
      // Handle error
    }
  };

  const sendMessage = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (msg.trim() === "") return; // Don't send empty messages

    const date = new Date();
    const sentDate = date.toISOString().slice(0, -5) + "Z";

    if (activeChat.user_type === "Builder") {
      let message = {
        room: `${uid}-${activeChat._id}`,
        messageId: uuid(),
        senderId: user.user_type === "employee" ? user.company_id : user._id,
        displayName:
          user.user_type === "employee"
            ? `${user.f_name} ${user.l_name}`
            : user.company_name,
        sentDate: sentDate,
        message: msg,
        hasImage: "false",
        user_type: activeChat.user_type,
        receiver_name: activeChat.name,
        receiver_id: activeChat._id,
        from: "Company",
        to: "Builder",
        message_kind: "text",
      };
      setMessages((prevMessages) => [...prevMessages, message]);
      socket.emit("privateMessage", activeChat._id, message);
    } else {
      let message = {
        room: `${uid}-${activeChat._id}`,
        messageId: uuid(),
        senderId: user.user_type === "employee" ? user.company_id : user._id,
        displayName:
          user.user_type === "employee"
            ? `${user.f_name} ${user.l_name}`
            : user.company_name,
        sentDate: sentDate,
        message: msg,
        hasImage: "false",
        user_type: activeChat.user_type,
        receiver_name: activeChat.name,
        receiver_id: activeChat._id,
        from: "Company",
        to: "Client",
        message_kind: "text",
      };
      setMessages((prevMessages) => [...prevMessages, message]);
      socket.emit("privateMessage", activeChat._id, message);
    }

    setMsg("");
  };

  // Handle form submission when Enter key is pressed
  const handleFormSubmit = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      sendMessage(e);
    }
  };

  useEffect(() => {
    if (!socket) return;
  }, [socket]);

  useEffect(() => {
    if (data?.message) {
      setUsers(data.message);
    }

    if (data?.message?.length > 0) {
      setActiveChat(data.message[0]);
    }
  }, [data]);

  useEffect(() => {
    chatMessages(uid, activeChat?._id).then((msg) => {
      setMessages(msg);
    });
  }, [uid, activeChat?._id, chatMessages]);

  useEffect(() => {
    if (data?.message) {
      const filteredUsersByCategory = data?.message.filter(
        (user) => user.user_type === category,
      );
      setUsers(filteredUsersByCategory);

      // Set active chat based on the category
      if (category === "Builder") {
        const firstBuilderUser = filteredUsersByCategory.find(
          (user) => user.user_type === "Builder",
        );
        setActiveChat(firstBuilderUser);
      } else if (category === "Client") {
        const firstClientUser = filteredUsersByCategory.find(
          (user) => user.user_type === "Client",
        );
        setActiveChat(firstClientUser);
      }
    }
  }, [category, data?.message]);

  const filteredUsers = search
    ? users.filter(
      (user) =>
        (user.name &&
          user.name.toLowerCase().includes(search.toLowerCase())) ||
        (user.text && user.text.toLowerCase().includes(search.toLowerCase())),
    )
    : users;

  useEffect(() => {
    if (socket && activeChat) {
      const room = `${uid}-${activeChat._id}`;
      socket.on("connect", () => {
        //console.log("connected to listen to messages:::");
        socket.emit("joinRoom", room, uid).listeners((eventNames) => {
          console.log("eventNames", eventNames);
        });
        //listen for messages on privateMessage channel
        socket.on("privateMessage", (senderId, message) => {
          console.log("message", senderId);
          setMessages((prevMessages) => [...prevMessages, message]);
          setShouldAutoScroll(true);
          handleScroll();
        });
      });
    }
  }, [socket, activeChat, uid]);

  useEffect(() => {
    if (shouldAutoScroll && chatMessagesContainerRef.current) {
      chatMessagesContainerRef.current.scrollTop =
        chatMessagesContainerRef.current.scrollHeight;
    }
  }, [shouldAutoScroll, messages]);

  // Handle user-initiated scroll interactions
  const handleScroll = () => {
    const element = chatMessagesContainerRef.current;
    if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
      // User has scrolled to the bottom
      setShouldAutoScroll(true);
    } else {
      // User has scrolled away from the bottom
      setShouldAutoScroll(false);
    }
  };

  useEffect(() => {
    if (image) {
      setPreviewImage(URL.createObjectURL(image));
    }
  }, [image]);

  return (
    <div className="h-[calc(100vh_-_150px)]">
      <div className="pl-12">
        <Heading label="Chats" />
      </div>
      {isLoading ? (
        <div className="px-12 mt-3 h-full">
          <div className="h-full flex items-start gap-7">
            <div className="relative w-96 h-full bg-white rounded-lg p-6 pb-10">
              <Skeleton className="h-10" />
              <div className="relative gap-5 items-center p-2 h-6 w-10/12 mx-auto flex mt-4 ring-1 ring-violet-100 rounded-full ring-offset-2 mb-5">
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
              </div>
              <div className="space-y-4">
                {Array(6)
                  .fill(null)
                  .map((_, idx) => (
                    <Skeleton key={idx} className="h-14" />
                  ))}
              </div>
            </div>
            <div className="flex-1 relative h-full bg-white/60 rounded-md">
              <div className="h-full rounded-lg flex flex-col">
                <div className="h-20 w-ful rounded-t-lg shadow-lg flex justify-between items-center p-8 bg-white border-b border-neutral-200">
                  <div className="flex">
                    <Skeleton className="h-12 w-12 object-cover rounded-full" />
                    <div className="ml-3 mt-1">
                      <Skeleton className="h-4 w-40 mb-2" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                </div>
                <div className="h-full rounded-lg flex flex-col justify-end p-5 space-y-4">
                  <Skeleton className="h-10 w-60" />
                  <Skeleton className="h-10 w-60 self-end" />
                  <Skeleton className="h-10 w-60 self-end" />
                  <Skeleton className="h-10 w-60" />
                  <Skeleton className="h-10 w-60" />
                  <Skeleton className="h-10 w-60 self-end" />
                </div>
                <div
                  className="relative h-16 bg-white rounded-b-lg flex justify-between gap-5 items-center p-8 border-t"
                >
                  <Skeleton className="flex-1 h-10" />
                  <div className="flex gap-2">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <Skeleton className="w-10 h-10 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="px-12 mt-3 h-full">
            <div className="h-full flex items-start gap-7">
              <div className="relative w-96 h-full bg-white rounded-lg p-6 pb-10">
                <div>
                  <div className="top-0 w-full border border-violet-50  rounded-lg">
                    <div className="flex items-center justify-center border pl-2">
                      <input
                        type="text"
                        placeholder="Search name"
                        className="h-10 w-full outline-none flex-1 placeholder:text-slate-400 text-[13px] font-normal"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <div className="w-16 flex justify-center items-center cursor-pointer">
                        <Icon
                          icon="iconamoon:search-thin"
                          className="text-slate-400 "
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative h-6 w-10/12 mx-auto flex mt-4 ring-1 ring-violet-100 rounded-full ring-offset-2">
                  <div
                    className={`absolute w-1/2 top-0 ${category === "Builder"
                      ? "translate-x-0"
                      : "translate-x-full"
                      } h-full px-5 py-2 bg-primary rounded-full shadow transform  duration-500`}
                  ></div>
                  <button
                    type="button"
                    className={`text-sm text-blue-900 bg-transparent flex-1 z-10 font-bold ${category === "Builder" && "text-white"
                      } duration-500`}
                    onClick={() => setCategory("Builder")}
                  >
                    Sub Contractors
                  </button>
                  <button
                    type="button"
                    className={`text-sm text-blue-900 bg-transparent flex-1 z-10 font-bold ${category === "Client" && "text-white"
                      } duration-500`}
                    onClick={() => setCategory("Client")}
                  >
                    Clients
                  </button>
                </div>

                <div className="mt-4 h-[calc(100vh_-_300px)] space-y-3 col-span-4 overflow-y-auto">
                  {filteredUsers.map((chat, index) => (
                    <div
                      onClick={() => handleActiveChat(chat)}
                      key={index}
                      className={`cursor-pointer border-b border-violet-50 h-16 flex justify-center items-center pb-3 px-3 rounded space-y-2 ${activeChat?._id === chat._id
                        ? "bg-primary text-white"
                        : ""
                        }`}
                    >
                      <img
                        src={chat.image}
                        alt=""
                        className="h-12 w-12 object-cover rounded-full mt-2"
                      />

                      <div className="w-full ml-2">
                        <div className=" h-6  w-full flex justify-between">
                          <h3
                            className={`${activeChat?._id === chat._id
                              ? "text-white"
                              : "text-blue-900"
                              } text-[15px] font-bold leading-snug`}
                          >
                            {chat.name}
                            <p className="text-[15px] mt-0">{chat.user_type}</p>
                          </h3>
                          <h3
                            className={`text-right  text-[13px] font-normal
                        ${activeChat?._id === chat._id
                                ? "text-white"
                                : "text-primary"
                              }
                        `}
                          >
                            {/* <TimeAgo timestamp={message.sentDate} /> */}
                          </h3>
                        </div>

                        <div className=" w-full flex justify-between items-center">
                          <p
                            className={`text-xs font-normal truncate overflow-hidden w-52 ${activeChat?._id === chat._id
                              ? "text-white"
                              : "text-blue-900"
                              }`}
                          >
                            {chat.text}
                          </p>
                          <div>
                            <Icon
                              icon="mdi:tick-all"
                              className={`h-5 w-5 
                             ${activeChat?._id === chat._id
                                  ? "text-white"
                                  : "text-primary"
                                }
                            `}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 relative h-full">
                {activeChat ? (
                  <div className="h-full  rounded-lg flex flex-col">
                    <div className="h-20 w-ful rounded-t-lg shadow-lg flex justify-between items-center p-8 bg-white border-b border-neutral-200">
                      <div className="flex">
                        <img
                          src={activeChat.image}
                          alt=""
                          className="h-12 w-12 object-cover rounded-full"
                        />
                        <div className="ml-3 mt-1">
                          <h3 className="text-blue-900 text-[15px] font-bold leading-snug">
                            {activeChat.name}
                          </h3>

                          <div className="flex items-center">
                            <img src="/images/done_all.png" alt="" />

                            <h3 className="text-primary text-sm font-semibold ml-1">
                              Online
                            </h3>
                          </div>
                        </div>
                      </div>

                      <div className="flex">
                        <div className="border rounded-full flex justify-center p-2 mr-2">
                          <Icon
                            icon="fluent:video-48-regular"
                            className="text-slate-400 h-4 w-4"
                          />
                        </div>
                        <div className="border rounded-full flex justify-center p-2">
                          <Icon
                            icon="ion:call-outline"
                            className="text-slate-400 h-4 w-4"
                          />
                        </div>
                      </div>
                    </div>

                    {/* ref={chatMessagesContainerRef} */}
                    <div
                      ref={chatMessagesContainerRef}
                      className="h-full w-full overflow-y-auto p-5 space-y-5 bg-white"
                    >
                      {messages?.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.senderId ===
                            (user.user_type === "employee"
                              ? user.company_id
                              : user._id)
                            ? "justify-end active-sender"
                            : "active-sender"
                            }`}
                        >
                          {message.senderId !==
                            (user.user_type === "employee"
                              ? user.company_id
                              : user._id) && (
                              <div>
                                <img
                                  src="/images/builder11.jpg"
                                  alt=""
                                  className="h-10 w-10 object-cover rounded-full mr-3"
                                />
                              </div>
                            )}
                          <div>
                            {message.message_kind === "image" && (
                              // eslint-disable-next-line jsx-a11y/img-redundant-alt
                              <img
                                src={message.message}
                                alt="Sent Image"
                                className="max-w-[300px] max-h-[300px] rounded-lg"
                              />
                            )}
                            {message.message_kind === "video" && (
                              <video
                                controls
                                className="max-w-[300px] max-h-[300px] rounded-lg"
                              >
                                <source
                                  src={message.message}
                                  type="video/mp4"
                                />
                                Your browser does not support the video tag.
                              </video>
                            )}
                            {message.message_kind === "location" && (
                              <div>
                                <LocationMap coordinates={message.message} />
                              </div>
                            )}
                            {message.message_kind === "text" && (
                              <div
                                className={`p-4 ${message.senderId ===
                                  (user.user_type === "employee"
                                    ? user.company_id
                                    : user._id)
                                  ? "bg-primary"
                                  : "bg-gray-50"
                                  } shadow-lg rounded-lg`}
                              >
                                <div
                                  className={`${message.senderId ===
                                    (user.user_type === "employee"
                                      ? user.company_id
                                      : user._id)
                                    ? "text-white"
                                    : "text-blue-900"
                                    } text-xs font-normal leading-[18px]`}
                                >
                                  {message.message}
                                </div>
                              </div>
                            )}
                            <TimeAgo timestamp={message.sentDate} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <form
                      onSubmit={sendMessage}
                      onKeyPress={handleFormSubmit}
                      className="relative h-16 bg-white rounded-b-lg flex justify-between items-center p-8 border-t"
                    >
                      <input
                        type="text"
                        placeholder="Send your message......."
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                        className="h-12 w-full placeholder:text-slate-400 placeholder:text-sm text-md placeholder:font-normal outline-none leading-normal"
                      />
                      <div className="flex">
                        <div
                          className={`${showMedia ? "flex" : "hidden"
                            }  absolute bottom-16 gap-2 flex-col`}
                        >
                          <label htmlFor="send-image">
                            <Icon
                              icon="material-symbols:imagesmode-outline-rounded"
                              fontSize={40}
                              className="block cursor-pointer p-1.5 text-white  rounded-full bg-primary"
                            />
                            <input
                              type="file"
                              name=""
                              id="send-image"
                              className="sr-only"
                              accept="image/*"
                              onChange={(e) => setImage(e.target.files[0])}
                            />
                          </label>
                          <label htmlFor="send-video">
                            <Icon
                              icon="mingcute:video-fill"
                              fontSize={40}
                              className="block cursor-pointer p-1.5 text-white  rounded-full bg-primary"
                            />
                            <input
                              type="file"
                              name=""
                              id="send-video"
                              className="sr-only"
                              accept="video/*"
                              onChange={handleVideoSelect}
                            />
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowMedia(!showMedia)}
                          className="border border-[#8593BF] rounded-full flex justify-center p-2 mr-2"
                        >
                          <Icon
                            icon="fluent:attach-20-filled"
                            className="text-[#8593BF] h-4 w-4"
                          />
                        </button>
                        <button className="bg-primary rounded-lg flex justify-center items-center p-2">
                          <Icon
                            icon="mingcute:send-fill"
                            className="text-white h-4 w-4"
                          />
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="h-full flex justify-center items-center">
                    <ChatPlaceholder />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      <Modal
        openModal={Boolean(image || video)}
        closeModal={() => {
          setImage(null);
          setVideo(null);
        }}
      >
        {/* Content for sending image */}
        {image && (
          <>
            <div className="flex justify-center">
              <img src={previewImage} alt="" className="rounded-md mb-5" />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => sendImage()}
                className="bg-primary py-2 px-5 text-white flex items-center gap-2 rounded-md"
              >
                <Icon
                  icon="mingcute:send-fill"
                  className="text-white h-4 w-4"
                />
                <span className="font-bold">Send</span>
              </button>
            </div>
          </>
        )}

        {/* Content for sending video */}
        {video && (
          <>
            <div className="flex justify-center">
              <video
                controls
                src={previewVideo}
                className="rounded-md mb-5"
                style={{ maxWidth: "100%" }}
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => sendVideo()}
                className="bg-primary py-2 px-5 text-white flex items-center gap-2 rounded-md"
              >
                <Icon
                  icon="mingcute:send-fill"
                  className="text-white h-4 w-4"
                />
                <span className="font-bold">Send</span>
              </button>
            </div>
          </>
        )}

        {/* Progress bar */}
        {uploadPercentage > 0 && uploadPercentage < 100 && (
          <div className="bg-gray-200 rounded-full h-2 my-5">
            <div
              className="bg-primary rounded-full h-2"
              style={{ width: `${uploadPercentage}%` }}
            ></div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Chat;
