import { useEffect, useState, useContext } from 'react'
import { App, Space, Typography, Table, Tag, Button } from 'antd'
import axios from 'axios'
import { debounce } from 'lodash'
import AppContext from '../contexts/AppContext'
const {Text} = Typography

function JobList() {
  const { fromDate, pipelines, jobs, setJobs } = useContext(AppContext)
  const { message, notification } = App.useApp()

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  function retry(job) {
    console.log("RETRY:", job)
    let date = new Date(job.startDate)
    axios({
      method: 'post',
      url: '/apiv1/state/action',
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        action: 'RUN',
        pipeline: job.pipeline,
        stage: job.stage,
        start: `${date.getFullYear()}${("0" + (date.getMonth() + 1)).slice(-2)}${(("0" + date.getDate()).slice(-2))}`
      }
    }).then(res => {
      console.log(res.data);
    }).catch(e => {
      console.error(e)
      message.error("error " + e.message);
    })
  }

  const columns = [{
    title: "Date",
    key: 'idState',
    dataIndex: 'startDate',
    sorter: (a, b) => {
      console.log(a, b);
      return new Date(a.startDate) > new Date(b.startDate)
    },
  }, {
    title: "Pipeline",
    key: 'idPipeline',
    dataIndex: 'pipeline',
    filters: [{
      text: "wrfchem_pipeline",
      value: "wrfchem_pipeline"
    }, {
      text: "mapNRT_pipeline",
      value: "mapNRT_pipeline"
    }],
    onFilter: (value, record) => (record.pipeline === value)
  }, {
    title: "Stage",
    key: 'idStage',
    dataIndex: 'stage',
    width: '200px',
    sorter: (row1, row2) => row1.idStage > row2.idStage
  }, {
    title: "Status",
    key: 'idState',
    filters: [{
      text: "Success",
      value: 1
    }, {
      text: "Running",
      value: 0
    }, {
      text: "Failed",
      value: -1
    }],
    onFilter: (value, record) => {
      if (value >= 0) {
        return record.status === value
      }
      else {
        return record.status <= value
      }
    },
    render: ({status}) => {
      return <Tag color={status > 0?"green":(status == 0?"gold":"red")}>{status > 0?"Success":(status == 0?"Running":"Failed")}</Tag>
    }
  }, {
    title: "Action",
    key: 'idState',
    width: "75px",
    render: (row) => (<Space>{row.status < 0?<Button type="link" onClick={() => retry(row)}>Retry</Button>:false}</Space>)
  }]
  return <Table dataSource={jobs} columns={columns} onChange={onChange} 
    pagination={{
      position: ['topRight']
    }}
  />
}

export default JobList

