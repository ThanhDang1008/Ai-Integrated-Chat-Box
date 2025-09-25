import { Input } from "antd";
import type { GetProps } from "antd";
import { useEffect, useState } from "react";
import "./search.scss";

import useDebounce from "@/utils/hooks/useDebounce.hook";
import { searchChatbot } from "@/services/api/chatbot";

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

type SearchChatBotProps = {
  setIdChatbot: React.Dispatch<React.SetStateAction<{ id: string }[]>>;
};

const SearchChatBot = (props: SearchChatBotProps) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedInputValue = useDebounce(searchValue, 500);

  const onSearch: SearchProps["onSearch"] = (value, _e, info) => {
    // console.log("value: ", value);
    // console.log("info: ", info);
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>
    //   | React.MouseEvent<HTMLElement>
    //   | React.KeyboardEvent<HTMLInputElement>
    //   | undefined
  ) => {
    //console.log("e___", e.target.value);
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    //console.log("debouncedInputValue: ", debouncedInputValue);
    const fetchData = async () => {
      const res = await searchChatbot(debouncedInputValue);
      //console.log("res: ", res.data);
      props.setIdChatbot(res.data.map((item) => ({ id: item._id })));
      if (res.data.length === 0) {
        props.setIdChatbot([
          {
            id: "Không tìm thấy chatbot nào",
          },
        ]);
      }
    };
    if (debouncedInputValue.trim() !== "") {
      fetchData();
    } else if (debouncedInputValue === "") {
      props.setIdChatbot([]);
    }
  }, [debouncedInputValue]);

  return (
    <>
    
      <Search className="search-chatbot"
        placeholder="Search chatbot"
        onSearch={onSearch}
        onChange={onChange}
        spellCheck={false}
      />
    </>
  );
};

export default SearchChatBot;
