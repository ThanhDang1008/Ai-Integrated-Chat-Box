import "./documents.scss";
import React from "react";
import {
  Button,
  Space,
  Switch,
  Table,
  Input,
  Modal,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { getFilesUser } from "../../../../services/api/user";
import { formatISODate } from "../../../../utils/formatTime";
import { message } from "antd";
import { useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import PdfRenderer from "../../../../utils/plugins/pdf";
import MSDocRenderer from "../../../../utils/plugins/doc";
import axios from "axios";

function Documents() {
  const { user } = useSelector((state) => state.account);
  const [fixed, setFixed] = React.useState(true);
  const [bordered, setBordered] = React.useState(true);
  const [expanded, setExpanded] = React.useState(false);
  const [empty, setEmpty] = React.useState(false);
  const [count, setCount] = React.useState(10000);
  const tblRef = React.useRef(null);

  const [dataSource, setDataSource] = React.useState([]);
  const [openModalFilePreview, setOpenModalFilePreview] = useState(false);
  const [dataFilePreview, setDataFilePreview] = useState({
    url: "",
    name: "",
    group: "",
  });
  const [modalDeleteDocument, setModalDeleteDocument] = useState({
    open: false,
    idConversation: "",
    titleConversation: "",
    idDocument: "",
    titleDocument: "",
    urlDocument: "",
    loading: false,
  });

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const typeFilesGroup = {
    "application/pdf": "PDF",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "DOCX",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
    "text/plain": "TXT",
  };

  const fetchdataSource = async () => {
    try {
      const response = await getFilesUser(user.id);
      //console.log("response", response);
      if (response.status === 200) {
        const data = response.data.data.files;
        const customData = data.map((item, index) => {
          return {
            id: item.id,
            name: item.originalname,
            url: item.keyfile
              ? `${import.meta.env.VITE_BACKEND_URL}/api/v1/file/${item.keyfile}`
              : item.urlCloudinary,
            group: typeFilesGroup[item.type],
            updated_at: formatISODate(item.updatedAt),
            created_at: formatISODate(item.createdAt),
          };
        });
        //console.log("customData", customData);
        setDataSource(customData);
        //console.log("customData", customData);
      }
    } catch (error) {
      if (error.response.status === 400) {
        message.error(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    fetchdataSource();
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const fixedColumns = [
    {
      title: "ID",
      dataIndex: "id",
      width: "10%",
      //fixed: "left",
    },
    {
      title: "Name",
      dataIndex: "name",
      width: "25%",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Group",
      dataIndex: "group",
      width: "8%",
      filters: [
        {
          text: "PDF",
          value: "PDF",
        },
        {
          text: "DOCX",
          value: "DOCX",
        },
        {
          text: "XLSX",
          value: "XLSX",
        },
        {
          text: "TXT",
          value: "TXT",
        },
      ],
      onFilter: (value, record) => record.group.indexOf(value) === 0,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      width: "15%",
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      width: "15%",
      sorter: (a, b) => a.updated_at.localeCompare(b.updated_at),
    },
    {
      title: "Action",
      width: "20%",
      //fixed: "right",
      render: (record) => {
        return (
          <Space>
            <Button
              type="primary"
              onClick={() => {
                setOpenModalFilePreview(true);
                setDataFilePreview({
                  url: record.url,
                  name: record.name,
                  group: record.group,
                });
              }}
            >
              View
            </Button>
            <Button type="default">Download</Button>
          </Space>
        );
      },
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: 50,
    },
    {
      title: "Action",
      width: 50,
      render: (record) => {
        return (
          <Space>
            <Button
              type="primary"
              onClick={() => {
                setOpenModalFilePreview(true);
                setDataFilePreview({
                  url: record.url,
                  name: record.name,
                  group: record.group,
                });
              }}
            >
              View
            </Button>
            <Button type="default">Download</Button>
          </Space>
        );
      },
    },
  ];

  const mergedColumns = React.useMemo(() => {
    if (!fixed) {
      return columns;
    }
    if (!expanded) {
      return fixedColumns;
    }
    return fixedColumns.map((col) => ({
      ...col,
      onCell: undefined,
    }));
  }, [expanded, fixed]);

  //console.log("dataFilePreview", dataFilePreview);
  const checkExistConversation = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/conversation/check-exist`,
        {
          urlfile: modalDeleteDocument.urlDocument,
        }
      );
      if (response.status === 200) {
        //console.log("checkExist", response.data);
        setModalDeleteDocument({
          ...modalDeleteDocument,
          open: true,
          idConversation: response.data.data.id,
          titleConversation: response.data.data.title,
        });
      }
    } catch (error) {
      if (error.response.status === 400) {
        console.log("checkExist", error.response.data);
        setModalDeleteDocument({
          ...modalDeleteDocument,
          open: true,
        });
        //message.error(error.response.data.message);
      }
    }
  };

  const handleDeleteDocument = async () => {
    try {
      //xoá cùng lúc promise all
      const [responseDocument, responseConversation] = await Promise.all([
        axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/file/delete/${modalDeleteDocument.idDocument}`
        ),
        modalDeleteDocument.idConversation &&
          axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/conversation/delete/${modalDeleteDocument.idConversation}`
          ),
      ]);
      //console.log("responseDocument", responseDocument);
      //console.log("responseConversation", responseConversation);
      if (responseDocument.status === 200) {
        setModalDeleteDocument({
          open: false,
          idConversation: "",
          titleConversation: "",
          idDocument: "",
          titleDocument: "",
          urlDocument: "",
          loading: false,
        });
        setDataSource((prev) =>
          prev.filter((item) => item.id !== modalDeleteDocument.idDocument)
        );
        message.success("Delete document successfully!");
      }
    } catch (error) {
      if (error.response.status === 400) {
        setModalDeleteDocument({
          open: false,
          idConversation: "",
          titleConversation: "",
          idDocument: "",
          titleDocument: "",
          urlDocument: "",
          loading: false,
        });
        message.error(error.response.data.message);
      }
    }
  };

  return (
    <>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h3>Documents</h3>
            <p>View all your uploaded documents here</p>
          </div>
          <div>
            {/* <Button type="dashed" onClick={() => setOpenModal(true)}>
              <i className="bi bi-chat-square"></i> New chat
            </Button> */}
          </div>
        </div>
        <div
          style={
            {
              //padding: "1%",
            }
          }
        >
          <Space
            direction="vertical"
            style={{
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Space>
                <Switch
                  checked={bordered}
                  onChange={() => setBordered(!bordered)}
                  checkedChildren="Bordered"
                  unCheckedChildren="Bordered"
                />
                <Switch
                  checked={fixed}
                  onChange={() => setFixed(!fixed)}
                  checkedChildren="Fixed"
                  unCheckedChildren="Fixed"
                />
                <Switch
                  checked={expanded}
                  onChange={() => setExpanded(!expanded)}
                  checkedChildren="Expandable"
                  unCheckedChildren="Expandable"
                />
              </Space>
              {modalDeleteDocument.idDocument && (
                <Space>
                  <Button
                    danger
                    onClick={() => {
                      checkExistConversation();
                    }}
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={() => {
                      setModalDeleteDocument({
                        ...modalDeleteDocument,
                        idDocument: "",
                        titleDocument: "",
                        urlDocument: "",
                      });
                    }}
                  >
                    <CloseOutlined />
                  </Button>
                </Space>
              )}

              {/* <Switch
                checked={empty}
                onChange={() => setEmpty(!empty)}
                checkedChildren="Empty"
                unCheckedChildren="Empty"
              /> */}
              {/* <Segmented
                value={count}
                onChange={(value) => setCount(value)}
                options={[
                  {
                    label: "None",
                    value: 0,
                  },
                  {
                    label: "Less",
                    value: 4,
                  },
                  {
                    label: "Lot",
                    value: 10000,
                  },
                ]}
              /> */}

              {dataSource.length >= 999 && (
                <Button
                  onClick={() => {
                    tblRef.current?.scrollTo({
                      index: 999,
                    });
                  }}
                >
                  Scroll To index 999
                </Button>
              )}
            </div>

            <Table
              bordered={bordered}
              virtual
              columns={mergedColumns}
              scroll={{
                y: 500,
                x: 1000,
              }}
              rowKey="id"
              dataSource={empty ? [] : dataSource}
              pagination={false}
              ref={tblRef}
              rowSelection={
                expanded
                  ? undefined
                  :
                {
                  type: "radio",
                  columnWidth: 30,
                  selectedRowKeys: modalDeleteDocument.idDocument
                    ? [modalDeleteDocument.idDocument]
                    : [],
                  onChange: (selectedRowKeys, selectedRows) => {
                    // console.log(
                    //   `selectedRowKeys: ${selectedRowKeys}`,
                    //   "selectedRows document: ",
                    //   selectedRows
                    // );
                    setModalDeleteDocument({
                      ...modalDeleteDocument,
                      idDocument: `${selectedRowKeys}`,
                      titleDocument: selectedRows[0].name,
                      urlDocument: selectedRows[0].url,
                    });
                  },
                }
              }
              //expandable={expandableProps}
            />
          </Space>
        </div>
      </div>
      {/* Modal preview file */}
      <Modal
        title={dataFilePreview.name}
        centered
        open={openModalFilePreview}
        //onOk={() => setOpenModalFilePreview(false)}
        okButtonProps={{ style: { display: "none" } }}
        onCancel={() => {
          setOpenModalFilePreview(false);
          setDataFilePreview({
            url: "",
            name: "",
            group: "",
          });
        }}
        cancelText="Close"
        width={1000}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {["PDF", "TXT"].includes(dataFilePreview.group) && (
            <PdfRenderer
              uri={dataFilePreview.url}
              style={{ width: "100%", height: "70vh" }}
            />
          )}
          {["DOCX", "XLSX"].includes(dataFilePreview.group) && (
            <MSDocRenderer
              url={dataFilePreview.url}
              style={{ width: "100%", height: "70vh" }}
            />
          )}
        </div>
      </Modal>
      {/* Modal delete file */}
      <Modal
        title={
          <>
            <i
              style={{
                color: "rgb(214 0 0)",
                paddingRight: "5px",
              }}
              className="bi bi-trash"
            ></i>{" "}
            Delete document
          </>
        }
        centered
        open={modalDeleteDocument.open}
        onOk={() => {
          setModalDeleteDocument({
            ...modalDeleteDocument,
            loading: true,
          });
          handleDeleteDocument();
        }}
        onCancel={() => {
          setModalDeleteDocument({
            open: false,
            idConversation: "",
            titleConversation: "",
            idDocument: "",
            titleDocument: "",
            urlDocument: "",
            loading: false,
          });
        }}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{
          danger: true,
          type: "default",
          disabled: modalDeleteDocument.loading,
        }}
      >
        <p>
          Are you sure you want to delete the document{" "}
          <strong>{modalDeleteDocument.titleDocument}</strong>
        </p>
        {modalDeleteDocument.idConversation && (
          <p>
            This document is used in the conversation{" "}
            <strong
              style={{
                color: "rgb(214 0 0)",
              }}
            >
              {modalDeleteDocument.titleConversation}
            </strong>
          </p>
        )}
      </Modal>
    </>
  );
}

export default Documents;
