import React, { useState } from "react";
import {
  Input,
  InputGroup,
  Table,
  Button,
  DOMHelper,
  Progress,
  Checkbox,
  Stack,
  SelectPicker,
} from "rsuite";
import { Box, Text, Spinner } from "@chakra-ui/react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import SearchIcon from "@rsuite/icons/Search";
import MoreIcon from "@rsuite/icons/legacy/More";
import { NameCell, ImageCell, CheckCell, ActionCell } from "./Cells.tsx";
import { Item } from "semantic-ui-react";

const { Column, HeaderCell, Cell } = Table;
const { getHeight } = DOMHelper;

const ratingList = Array.from({ length: 5 }).map((_, index) => {
  return {
    value: index + 1,
    label: Array.from({ length: index + 1 })
      .map(() => "⭐️")
      .join(""),
  };
});

const DataTable = () => {
  const [checkedKeys, setCheckedKeys] = useState<number[]>([]);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [rating, setRating] = useState<number | null>(null);

  const [loading, setLoading] = useState();
  const [data2, setData2] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const data = data2;
  const handleSubmit = (event) => {
    setLoading(true);
    axios({
      url: `https://${process.env.REACT_APP_API_BASEURL}/api/dhcp/leases/${userInput}`,
      method: "GET",
      dataResponse: "json",
      params: {
        query: userInput,
      },
    })
      .then((response) => {
        setLoading(true);
        setData2(response.data);
      })
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  let checked = false;
  let indeterminate = false;

  if (checkedKeys.length === data.length) {
    checked = true;
  } else if (checkedKeys.length === 0) {
    checked = false;
  } else if (checkedKeys.length > 0 && checkedKeys.length < data.length) {
    indeterminate = true;
  }

  const handleCheckAll = (_value, checked) => {
    const keys = checked
      ? data.map((item) => item.ipAddress, Item.clientId)
      : [];
    setCheckedKeys(keys);
  };
  const handleCheck = (value, checked) => {
    const keys = checked
      ? [...checkedKeys, value]
      : checkedKeys.filter((item) => item !== value);
    setCheckedKeys(keys);
    console.log(value);
  };

  const handleSortColumn = (sortColumn, sortType) => {
    setSortColumn(sortColumn);
    setSortType(sortType);
  };

  const filteredData = () => {
    const filtered = data.filter((item) => {
      if (!item.clientId.includes(searchKeyword)) {
        return false;
      } else return true;
    });

    if (sortColumn && sortType) {
      return filtered.sort((a, b) => {
        let x: any = a[sortColumn];
        let y: any = b[sortColumn];

        if (typeof x === "string") {
          x = x.charCodeAt(0);
        }
        if (typeof y === "string") {
          y = y.charCodeAt(0);
        }

        if (sortType === "asc") {
          return x - y;
        } else {
          return y - x;
        }
      });
    }
    return filtered;
  };
  const styles = {
    border: "none",
    outline: "none",
  };

  return (
    <>
      <Box>
        <Box alignItems={"center"} justifyContent={"left"} marginLeft={24}>
          <Box
            boxShadow={"xl"}
            rounded={"lg"}
            p={6}
            textAlign={"center"}
            backgroundColor={"gray.200"}
            mt={24}
            w={"450px"}
            maxWidth={"450px"}
            mb={12}
          >
            <form action="">
              <Text
                textAlign={"center"}
                alignItems={"center"}
                justifyContent={"center"}
                textOverflow={"ellipsis"}
                width={"400px"}
                pb={3}
              >
                Search for All Leases by Scope ID
              </Text>
              <InputGroup style={styles}>
                <Stack
                  direction={["column", "row"]}
                  spacing="12px"
                  justifyContent={"center"}
                  justifyItems={"center"}
                  alignItems={"center"}
                >
                  <Input
                    backgroundColor={"gray.100"}
                    justifyItems={"center"}
                    ml={12}
                    justifyContent={"center"}
                    textAlign={"center"}
                    w={["50%", "50%"]}
                    type="text"
                    placeholder="Scope ID"
                    id="search"
                    value={userInput}
                    onChange={setUserInput}
                  />
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={loading || userInput.length < 8}
                    size="md"
                    color="gray.600"
                    outlineColor={"gray.300"}
                  >
                    {loading === true ? (
                      <Spinner
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="blue.500"
                        size="sm"
                      />
                    ) : (
                      "Search"
                    )}
                  </Button>
                </Stack>
              </InputGroup>
            </form>
          </Box>
        </Box>
      </Box>
      <Stack className="table-toolbar" justifyContent="space-between">
        <Stack spacing={6}>
          <InputGroup inside>
            <Input
              placeholder="Search"
              value={searchKeyword}
              onChange={setSearchKeyword}
            />
            <InputGroup.Addon>
              <SearchIcon />
            </InputGroup.Addon>
          </InputGroup>
        </Stack>
      </Stack>

      <Table
        height={Math.max(getHeight(window) - 200, 400)}
        data={filteredData()}
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={handleSortColumn}
      >
        <Column width={200}>
          <HeaderCell>IP Address</HeaderCell>
          <NameCell dataKey="ipAddress" />
        </Column>
        <Column width={50} fixed>
          <HeaderCell style={{ padding: 0 }}>
            <div style={{ lineHeight: "40px" }}>
              <Checkbox
                inline
                checked={checked}
                indeterminate={indeterminate}
                onChange={handleCheckAll}
              />
            </div>
          </HeaderCell>
          <CheckCell
            dataKey="ipAddress"
            checkedKeys={checkedKeys}
            onChange={handleCheck}
          />
        </Column>

        <Column width={200} sortable>
          <HeaderCell>MAC Address</HeaderCell>
          <Cell dataKey="clientId">{(rowData) => `${rowData.clientId}`}</Cell>
        </Column>

        <Column width={300}>
          <HeaderCell>Name</HeaderCell>
          <Cell dataKey="hostName" />
        </Column>

        <Column width={120}>
          <HeaderCell>Action</HeaderCell>
          <ActionCell dataKey="" />
        </Column>
      </Table>
    </>
  );
};

export default DataTable;
