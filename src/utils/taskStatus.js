const taskStatus = (value) => {
  let status = "";

  switch (value) {
    case -2:
      status = "ALL";
      break;
    case -1:
      status = "TASKS OPEN FOR BID";
      break;
    case 0:
      status = "UNASSIGNED";
      break;
    case 1:
      status = "ASSIGNED";
      break;
    case 2:
      status = "TODO";
      break;
    case 3:
      status = "STARTED";
      break;
    case 4:
      status = "WORK IN PROGRESS";
      break;
    case 5:
      status = "COMPLETED";
      break;
    case 6:
      status = "BREAK";
      break;
    case 7:
      status = "RESUME";
      break;
    default:
      status = "";
  }

  return status;
};

export default taskStatus;
