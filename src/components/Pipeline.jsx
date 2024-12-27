import {App, Divider, Tag, Button, Dropdown, Typography, Space} from 'antd'
import axios from 'axios'
const { Text } = Typography

//const HEIGHT = 400
const HEIGHT = 100
export default function Pipeline({date, jobs}) {
  const { message, notification } = App.useApp();
  function statusColor(job) {
    if (job.status > 0) return "#585";
    if (job.status < 0 && job.status > -10) return "#855";
    if (job.status <= -10) return "#888";
    return "#fa5";
  } 
  function statusClass(job) {
    if (job.status > 0) return "job-success";
    if (job.status < 0 && job.status > -10)  return "job-failed";
    if (job.status <= -10) return "job-notrun";
    return "job-running";
  }
  function statusLabel(job) {
    if (job.status > 0) return "[success]";
    if (job.status < 0 && job.status > -10)  return "[failed]";
    if (job.status <= -10) return "[not run]";
    return "[running]";
  }
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
    });
    message.success('Send RUN request');
  }
  function forceRetry(job) {
    console.log("RETRY:", job)
    let date = new Date(job.startDate)
    axios({
      method: 'post',
      url: '/apiv1/state/action',
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        action: 'FORCE_RUN',
        pipeline: job.pipeline,
        stage: job.stage,
        start: `${date.getFullYear()}${("0" + (date.getMonth() + 1)).slice(-2)}${(("0" + date.getDate()).slice(-2))}`
      }
    }).then(res => {
      console.log(res.data);
    }).catch(e => {
      console.error(e)
      message.error("error " + e.message);
    });
    message.success('Send RUN request');
  }
  const hTranslate = (job) => `${(job.level - 1)*100}%`
  const vTranslate = (job) => {
    if (job.pipeline === "mapNRT_pipeline") return "100%"
    if (job.pipeline === "wrfchem_pipeline") return "200%"
    return "0"
  }

  return (<div style={{width: '100%'}}>
    <Divider orientation="left">{date}</Divider>
    <div style={{ height: `${HEIGHT}px`, position: 'relative', border: "1px solid #aaa"}}>
      <div className="lane"></div>
      {/*<div className="lane even-lane"></div>
      <div className="lane"></div>
      <div className="lane even-lane"></div>*/}
      {jobs.map((j, idx) => (
        <div key={idx} className={"stage"}
          style={{
            transform: `translate(${hTranslate(j)}, ${vTranslate(j)})`
          }}>
          <Tag color={statusColor(j)} className={ statusClass(j) }><Dropdown trigger="click" style={{width: '100%'}} menu={{
              items: [{
                key: 1,
                label: (<Button style={{width: '100%'}} onClick={() => {retry(j)}}>Run</Button>)
              }, {
                key: 2,
                label: (<Button onClick={() => {forceRetry(j)}}>Force Rerun</Button>)
              }]
            }}><Space stype={{width: '100%', textAlign:"center", cursor: 'pointer' }} direction="vertical">
              <div className="small-text">{j.stage}</div>
              <div className="small-text">{statusLabel(j)}</div>
            </Space>
          </Dropdown></Tag>
        </div>
      ))}
    </div>
  </div>)
}
