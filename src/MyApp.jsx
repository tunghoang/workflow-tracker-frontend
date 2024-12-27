import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { debounce } from 'lodash'
import axios from 'axios'
import { App, Button, Space, Typography, Layout, theme, DatePicker, Checkbox, Form } from 'antd'

import AppContext from './contexts/AppContext'

import Overview from './components/Overview'
import WorkerList from './components/WorkerList'

const { Sider, Content, Header, Footer } = Layout
const { Title, Text } = Typography

function MyApp() {
  let from = new Date(Date.now())
  from.setDate(from.getDate() - 7)
  from = `${from.getFullYear()}-${('0' + (from.getMonth() + 1)).slice(-2)}-${('0' + from.getDate()).slice(-2)}`;
  const {message, notification} = App.useApp();
  const [fromDate, setFromDate] = useState(from)
  const [pipelines, setPipelines] = useState({'HIMAWARI_pipeline': true})
  const [jobs, setJobs] = useState([])
  const [counter, setCounter] = useState(0)
  const [workers, setWorkers] = useState([])
  const {
    token: { colorBgContainer }
  } = theme.useToken()

  const getTasks = debounce(function() {
    axios({
      method: 'put',
      url: '/apiv1/state/',
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        pipeline: Object.keys(pipelines).filter(p => pipelines[p]),
        fromDate: fromDate
      }
    }).then(res => {
      console.log('res.data', res.data)
      setJobs(res.data.length > 0?res.data:[{
        "idState": null,
        "startDate": fromDate,
        "status": -10,
        "pipeline": "HIMAWARI_pipeline",
        "stage": "HimaPreprocess",
        "level": 1
      }, {
        "idState": null,
        "startDate": fromDate,
        "status": -10,
        "pipeline": "HIMAWARI_pipeline",
        "stage": "DEMPreprocess",
        "level": 2
      }, {
        "idState": null,
        "startDate": fromDate,
        "status": -10,
        "pipeline": "HIMAWARI_pipeline",
        "stage": "caliHimawariOnly",
        "level": 3
      }, {
        "idState": null,
        "startDate": fromDate,
        "status": -10,
        "pipeline": "HIMAWARI_pipeline",
        "stage": "PostProcess",
        "level": 4
      }, {
        "idState": null,
        "startDate": fromDate,
        "status": -10,
        "pipeline": "HIMAWARI_pipeline",
        "stage": "ODCImport",
        "level": 5
      }, {
        "idState": null,
        "startDate": fromDate,
        "status": -10,
        "pipeline": "HIMAWARI_pipeline",
        "stage": "TerracottaImport",
        "level": 6
      }])
    }).catch(e => {
      console.error(e)
      message.error("error " + e.message);
    })
  }, 500)

  const getWorkers = debounce(function() {
    axios({
      method: 'get',
      url: '/apiv1/state/workers',
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      setWorkers(res.data)
    }).catch(e => {
      console.error(e)
      message.error("error " + e.message);
    })
  }, 500);
  useEffect(() => { 
    getTasks();
    getWorkers();
  }, [fromDate, pipelines, counter]);
  
  setTimeout(() => {
    setCounter(counter + 1);
  }, 5000)

  return (
    <App>
      <Layout>
        <Layout>
          <AppContext.Provider value={{fromDate, pipelines, jobs, setJobs, workers}}>
            <Content style={{background: colorBgContainer, padding: '0 24px'}}>
              <Space direction="vertical" style={{width: '100%'}}>
                <Typography>
                  <Title>Pipeline Job Monitoring</Title>
                </Typography>
                <WorkerList />
                <Overview />
              </Space>
            </Content>
          </AppContext.Provider>
          <Sider with={200} style={{background: colorBgContainer, minHeight: '100vh', padding: '12px', boxShadow: "-1px 1px 3px #ccc"}}>
            <Space direction="vertical" size="middle">
              <DatePicker defaultValue={dayjs(from, "YYYY-MM-DD")} onChange={(date, dateString) => setFromDate(dateString)} />
              {/*<Checkbox checked={ pipelines.mapNRT_pipeline } 
                onChange={() => setPipelines({
                  mapNRT_pipeline: !pipelines.mapNRT_pipeline,
                  wrfchem_pipeline: pipelines.wrfchem_pipeline
                })}
              >Map Near Realtime</Checkbox>
              <Checkbox 
                onChange={() => setPipelines({
                  mapNRT_pipeline: pipelines.mapNRT_pipeline,
                  wrfchem_pipeline: !pipelines.wrfchem_pipeline
                })}
              >WRF-Chem</Checkbox>*/}
            </Space>
          </Sider>
        </Layout>
      </Layout>
    </App>
  )
}

export default MyApp
