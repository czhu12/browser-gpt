import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { getThreads } from "../../../utils/api"
import axios from 'axios';

const Thread = ({thread}) => {
  return <div>
    {thread.id}
  </div>
}
const fetchPanets = async () => {
  const result = await axios.get('https://swapi.dev/api/people')
  return result.data;
}

const ThreadList = () => {
  const { status, data, error, isFetching } = useQuery({ queryKey: ["planets"], queryFn: getThreads });
  console.log(data)
  return <div>{isFetching}</div>
};

export default ThreadList;
