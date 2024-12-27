import { useEffect, useState, useContext } from 'react'
import { App, Space, Typography, Tag } from 'antd'
import axios from 'axios'
import AppContext from '../contexts/AppContext'
const {Text, Title} = Typography

function WorkerList() {
  const { workers } = useContext(AppContext);
  return <Space direction='vertical'><Title level={4}>Workers</Title>
    {workers?workers.map((w, idx) => <Tag key={idx} color={w.status === 'busy'?"red":"green"}><div style={{fontWeight: 700}}>{w.name}</div><div style={{fontStyle: 'italic'}}>{w.job}</div></Tag>):false}
  </Space>
}

export default WorkerList
