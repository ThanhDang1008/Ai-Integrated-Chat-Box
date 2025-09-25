import Header from "./(components)/header";
import Chatbots from "./(components)/chatbots";
import "./list-chatbot.scss";
import Footer from "./(components)/footer";

function ListChatbot() {
  return (
    <>
      <div className="chatbot">
        <div className="header_ListChatbot_container">
          <Header></Header>
        </div>

        <div className="pagecontainer-grid">
          <div className="pagecontainer_list">
            <Chatbots />
          </div>
        </div>
        <div className="page_footer_chatbot">
          <Footer></Footer>
        </div>
      </div>
    </>
  );
}

export default ListChatbot;
