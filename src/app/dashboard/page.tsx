"use client";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import { Select, MenuItem, Backdrop, CircularProgress } from "@mui/material";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import {
  HeaderGroup,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";

import { Table } from "@tanstack/react-table";
import { prepareURLEncodedParams } from "@/util/params";
// import {
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
// } from "@mui/material";
import moment from "moment";

import {
  getExpandedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
export default function page() {
  const [data, setData] = useState<any>([]);

  const columns = [
    {
      accessorFn: (row: any) => row.serial,
      id: "serial",
      // cell: (info: any) => <span>{info.getValue()}</span>,
      header: () => <span>S.No</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) => row.area,
      id: "area",
      // cell: (info: any) => <span>{info.getValue()}</span>,
      header: () => <span>Area</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) => row.title,
      id: "title",
      // cell: (info: any) => <span>{info.getValue()}</span>,
      header: () => <span>title</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) => row.location_id.title,
      id: "locationid",
      // cell: (info: any) => <span>{info.getValue()}</span>,
      header: () => <span>location</span>,
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: any) => row.createdAt,
      id: "date",

      cell: (info: any) => {
        let date = info.getValue();
        const formattedDate = moment(new Date(date)).format("DD-MM-YYYY");
        return formattedDate;

        return <span>{date}</span>;
      },
      header: () => <span>createdAt</span>,
      footer: (props: any) => props.column.id,
    },
  ];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [currentpage, setCurrentPage] = useState(1);
  const [totalpage, setTotalPage] = useState(10);
  const [paginationlimit, setPaginationLimit] = useState(20);
  const [locationdetails, setLocationDetails] = useState([]);
  const accessToken = useSelector(
    (state: any) => state.userLogin.userDetails.access_token
  );
  const [paginationDetails, setPaginationDetails] = useState<any>({});
  // console.log(accessToken);
  const getAllFarms = async ({
    page = 1,
    limit = 10,
    location_id,
  }: Partial<{
    page: number | string;
    limit: number | string;
    location_id: string;
  }>) => {
    console.log(location_id);

    setLoading(true);
    let options = {
      method: "GET",
      headers: new Headers({
        authorization: accessToken,
      }),
    };

    let queryparams: any = {};
    if (location_id) {
      queryparams["location_id"] = location_id;
    }
    try {
      const varName = `${process.env.NEXT_PUBLIC_API_URL}`;
      const endpoint = `/farms/${page}/${limit}`;
      const result = `${varName}${endpoint}`;
      let url = prepareURLEncodedParams(result, queryparams);

      const response = await fetch(url, options);
      console.log(response);
      const responseData = await response.json();
      const { data, ...rest } = responseData;
      console.log(responseData);
      if (responseData.success) {
        setData(data);
        setPaginationDetails(rest);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const locationDetails = async () => {
    setLoading(true);
    let options = {
      method: "GET",
      headers: new Headers({
        authorization: accessToken,
      }),
    };
    try {
      const varName = `${process.env.NEXT_PUBLIC_API_URL}`;
      const endpoint = `/locations/all`;
      const result = `${varName}${endpoint}`;
      const response = await fetch(result, options);
      console.log(response);
      const responseData = await response.json();
      const { data, ...rest } = responseData;
      console.log(responseData);

      if (responseData.success) {
        setLocationDetails(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOnPageChange = (_: any, value: number) => {
    console.log(value);
    getAllFarms({ page: value, limit: 20 });
  };
  const handlePaginationMenuChange = (event: any) => {
    console.log(event.target.value);
    getAllFarms({});
  };

  useEffect(() => {
    if (accessToken) {
      getAllFarms({});
      locationDetails();
    }
  }, [accessToken]);

  return (
    <div>
      <Autocomplete
        onChange={(event: any, newValue: any) => {
          getAllFarms({ location_id: newValue._id });
        }}
        disablePortal
        id="combo-box-demo"
        options={locationdetails?.length ? locationdetails : []}
        getOptionLabel={(option) => option.title}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="location" />}
      />
      {/* <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">area</TableCell>
              <TableCell align="left">id&nbsp;(g)</TableCell>
              <TableCell align="left">location&nbsp;(g)</TableCell>
              <TableCell align="left">createdAt&nbsp;(g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((val: any, key: any) => (
              <TableRow
                key={val?._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">{val?.title}</TableCell>
                <TableCell align="left">{val?.area}</TableCell>
                <TableCell align="left">{val?.location_id?.title}</TableCell>
                <TableCell align="left">{val?.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}
      <table
        className="table"
        border={0}
        style={{ borderSpacing: "0 !important" }}
      >
        <thead
          className="thead"
          style={{
            height: "32px",
            position: "sticky",
            top: "0px",
            zIndex: "2",
          }}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <tr className="table-row" key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th className="cell" key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          cursor: "pointer",
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="tbody">
          {table.getFilteredRowModel().rows.map((row) => {
            return (
              <tr className="table-row" key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td className="cell" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <Select
        value={paginationDetails?.limit ? paginationDetails?.limit : 10}
        onChange={handlePaginationMenuChange}
        sx={{
          width: 50,
          height: 50,
        }}
      >
        <MenuItem value={5}>5</MenuItem>
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={15}>15</MenuItem>
        <MenuItem value={20}>20</MenuItem>
      </Select>

      <br></br>
      <Stack spacing={2}>
        {!loading ? (
          <Pagination
            count={paginationDetails?.total_pages}
            page={paginationDetails?.page}
            onChange={handleOnPageChange}
          />
        ) : (
          ""
        )}
      </Stack>
      <Backdrop open={loading}>
        <CircularProgress sx={{ color: "white" }} />
      </Backdrop>
    </div>
  );
}
