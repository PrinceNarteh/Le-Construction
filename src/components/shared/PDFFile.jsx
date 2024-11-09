import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import RalawayBold from "../../assets/fonts/Raleway-Bold.ttf";
import RalawayRegular from "../../assets/fonts/Raleway-Regular.ttf";

Font.register({
  family: "Raleway",
  fonts: [
    {
      src: RalawayRegular,
    },
    {
      src: RalawayBold,
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  container: {
    minHeight: "100vh",
    padding: "10px",
    fontFamily: "Raleway",
  },
  headerContainer: {
    borderRadius: "6px",
    display: "flex",
  },
  headerLeft: {
    padding: "24px",
    borderTopLeftRadius: "6px",
    borderBottomLeftRadius: "6px",
    flex: 2,
  },
  headerRight: {
    flex: 1,
    backgroundColor: "rgb(64,64,64)",
    color: "white",
    borderTopRightRadius: "6px",
    borderBottomRightRadius: "6px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: "28px",
    // lineHeight: "40px",
    fontWeight: 600,
    color: "white",
  },
  date: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "4px",
    gap: "5px",
  },
  tableHeader: {
    display: "flex",
    flexDirection: "row",
    fontSize: "12px",
    width: "100%",
    fontWeight: 700,
    borderBottom: "1px solid black",
    paddingBottom: "5px",
  },
  tableBody: {
    display: "flex",
    flexDirection: "row",
    fontSize: "12px",
    paddingVertical: "8px",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: "50%",
    border: "1px solid teal",
  },
  footer: {
    borderTop: "1px solid gray",
    paddingTop: "10px",
    fontSize: "10px",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },
});

const PDFFile = ({ data, user, companySettings }) => {
  console.log(data, user, companySettings);
  return (
    <Document>
      <Page size="A4">
        <View style={styles.container}>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <View
              style={[
                styles.headerLeft,
                { backgroundColor: `${user.company.brand?.primary_color}` },
              ]}
            >
              <Text style={styles.title}>{data?.title}</Text>
            </View>

            <View style={styles.headerRight}>
              <Text style={{ fontSize: "12px" }}>
                Grand Total ({user.company.company_settings?.currency.symbol})
              </Text>
              <Text style={{ fontSize: "22px" }}>
                {user.company.company_settings?.currency.symbol}
                {data?.total}
              </Text>
            </View>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              padding: "20px",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "rgb(75, 85, 99)",
                }}
              >
                BILL TO
              </Text>
              <Text style={{ fontSize: "16px" }}>
                {data?.client.first_name} {data?.client.last_name}
              </Text>
            </View>

            <View style={{ fontSize: "10px" }}>
              <View style={styles.date}>
                <Text style={{ fontWeight: 700 }}>Estimate Number:</Text>
                <Text style={{ color: "rgb(75, 85, 99)" }}>1</Text>
              </View>
              <View style={styles.date}>
                <Text style={{ fontWeight: 7000 }}>Estimate Date:</Text>
                <Text style={{ color: "rgb(75, 85, 99)" }}>{data?.date}</Text>
              </View>
              <View style={styles.date}>
                <Text style={{ fontWeight: 700 }}>Expires On: </Text>
                <Text style={{ color: "rgb(75, 85, 99)" }}>
                  {data?.dueDate}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ paddingHorizontal: "12px", flex: 1 }}>
            <View style={{ flex: 1 }}>
              <View style={styles.tableHeader}>
                <View style={{ flex: 5, marginLeft: "10px" }}>
                  <Text>Items</Text>
                </View>
                <View style={{ flex: 2 }}>
                  <Text style={{ textAlign: "center" }}>Quantity</Text>
                </View>
                <View style={{ flex: 2 }}>
                  <Text style={{ textAlign: "center" }}>
                    Price({user.company.company_settings?.currency.symbol})
                  </Text>
                </View>
                <View style={{ flex: 2 }}>
                  <Text style={{ textAlign: "center" }}>
                    Amount({user.company.company_settings?.currency.symbol})
                  </Text>
                </View>
              </View>

              {/*Table Head*/}
              {data?.products.map((product, idx) => (
                <View key={idx} style={styles.tableBody}>
                  <View style={{ flex: 5, marginLeft: "10px" }}>
                    <Text>{product.name}</Text>
                  </View>
                  <View style={{ flex: 2, textAlign: "center" }}>
                    <Text>{product.quantity}</Text>
                  </View>
                  <View style={{ flex: 2, textAlign: "center" }}>
                    <Text>{product.price}</Text>
                  </View>
                  <View style={{ flex: 2, textAlign: "center" }}>
                    <Text>{product.price * product.quantity}</Text>
                  </View>
                </View>
              ))}

              <View style={styles.tableBody}>
                <View style={{ flex: 7 }}></View>
                <View
                  style={{
                    flex: 4,
                    display: "flex",
                    flexDirection: "row",
                    paddingVertical: "8px",
                    borderTop: "1px solid gray",
                    borderBottom: "1px solid gray",
                  }}
                >
                  <View style={{ flex: 2, textAlign: "center" }}>
                    <Text style={{ fontWeight: "ultrabold" }}>Sub Total:</Text>
                  </View>
                  <View style={{ flex: 2, textAlign: "center" }}>
                    <Text>{data?.sub_total}</Text>
                  </View>
                </View>
              </View>

              {/*Total*/}
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  fontSize: "12px",
                }}
              >
                <View style={{ flex: 7 }}></View>
                <View
                  style={{
                    flex: 4,
                    display: "flex",
                    flexDirection: "row",
                    borderBottom: "2px double gray",
                    paddingBottom: "8px",
                  }}
                >
                  <View style={{ flex: 2, textAlign: "center" }}>
                    <Text style={{ fontWeight: "ultrabold" }}>
                      Grand Total:
                    </Text>
                  </View>
                  <View style={{ flex: 2, textAlign: "center" }}>
                    <Text>{data?.total}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <View
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{
                    uri: user.company.company_logo,
                    method: "GET",
                  }}
                  style={styles.image}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 700 }}>{user.company_name}</Text>
                <Text>{user?.address?.street}</Text>
                <Text>{user?.address?.city}</Text>
                <Text>{user?.address?.state}</Text>
                <Text>Ghana</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "bold" }}>Contact Information</Text>
                <Text>Phone: {data?.phoneNumber}</Text>
                <Text>Email: {user?.email}</Text>
                <Text>www.nailed.biz</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PDFFile;
