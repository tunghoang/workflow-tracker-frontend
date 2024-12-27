import {useContext, useEffect, useState} from 'react'
import { Space, Typography } from 'antd'
import AppContext from '../contexts/AppContext'
import Pipeline from "./Pipeline"
const {Text, Title} = Typography

/*const jobTemplates = [{
  "idState": null,
  "startDate": null,
  "status": -10,
  "pipeline": "map_pipeline",
  "stage": "downloadNDVI",
  "level": 1
}, {
  "idState": null,
  "startDate": null,
  "status": -10,
  "pipeline": "map_pipeline",
  "stage": "NDVIPreprocess",
  "level": 2
}, {
  "idState": null,
  "startDate": null,
  "status": -10,
  "pipeline": "map_pipeline",
  "stage": "downloadData",
  "level": 3
}, {
  "idState": null,
  "startDate": null,
  "status": -10,
  "pipeline": "map_pipeline",
  "stage": "ImgPreprocess",
  "level": 4
}, {
  "idState": null,
  "startDate": null,
  "status": -10,
  "pipeline": "mapNRT_pipeline",
  "stage": "downloadData",
  "level": 1
}, {
  "idState": null,
  "startDate": null,
  "status": -10,
  "pipeline": "wrfchem_pipeline",
  "stage": "GetFNL",
  "level": 1
}, {
  "idState": null,
  "startDate": null,
  "status": -10,
  "pipeline": "mapNRT_pipeline",
  "stage": "ImgPreprocess",
  "level": 2
}, {
  "idState": null,
  "startDate": null,
  "status": -10,
  "pipeline": "wrfchem_pipeline",
  "stage": "runWPS",
  "level": 2
}, {
  "idState": null,
  "startDate": null,
  "status": -10,
  "pipeline": "wrfchem_pipeline",
  "stage": "runREAL",
  "level": 3
}, {
  "idState": null,
  "startDate": null,
  "status": -10,
  "pipeline": "wrfchem_pipeline",
  "stage": "runEMISS",
  "level": 4
}, {
  "idState": null,
  "startDate": null,
  "status": -10,
  "pipeline": "wrfchem_pipeline",
  "stage": "runWRF",
  "level": 5
}, {
  "idState": null,
  "startDate": null,
  "status": -10,
  "pipeline": "wrfchem_pipeline",
  "stage": "WRFpostprocessing",
  "level": 6
}, {
  "idState": null,
  "startDate": null,
  "status": -10,
  "pipeline": "mapNRT_pipeline",
  "stage": "WRFChemProcessing",
  "level": 7
}, {
  "idState": null,
  "startDate": null,
  "status": -10,
  "pipeline": "mapNRT_pipeline",
  "stage": "PM25predict",
  "level": 8
}, {
  "idState": null,
  "startDate": null,
  "status": -10,
  "pipeline": "mapNRT_pipeline",
  "stage": "UploadFile",
  "level": 9
}, {
  "idState": null,
  "startDate": null,
  "status": -10,
  "pipeline": "wrfchem_pipeline",
  "stage": "UploadFile",
  "level": 9
}, {
  "idState": null,
  "startDate": null,
  "status": -10,
  "pipeline": "mapNRT_pipeline",
  "stage": "UploadToDB",
  "level": 10
}, {
  "idState": null,
  "startDate": null,
  "status": -10,
  "pipeline": "wrfchem_pipeline",
  "stage": "UploadToDB",
  "level": 10
}]*/
const jobTemplates = [{
  "idState": null,
  "startDate": null,
  "status": -10,
  "pipeline": "HIMAWARI_pipeline",
  "stage": "HimaPreprocess",
  "level": 1
}, {
  "idState": null,
  "startDate": null,
  "status": -10,
  "pipeline": "HIMAWARI_pipeline",
  "stage": "DEMPreprocess",
  "level": 2
}, {
  "idState": null,
  "startDate": null,
  "status": -10,
  "pipeline": "HIMAWARI_pipeline",
  "stage": "CaliHimawariOnly",
  "level": 3
}, {
  "idState": null,
  "startDate": null,
  "status": -10,
  "pipeline": "HIMAWARI_pipeline",
  "stage": "PostProcess",
  "level": 4
}, {
  "idState": null,
  "startDate": null,
  "status": -10,
  "pipeline": "HIMAWARI_pipeline",
  "stage": "ODCImport",
  "level": 5
}, {
  "idState": null,
  "startDate": null,
  "status": -10,
  "pipeline": "HIMAWARI_pipeline",
  "stage": "TerracottaImport",
  "level": 6
}]
function Overview() {
  const {fromDate, pipelines, jobs, setJobs} = useContext(AppContext)
  const [days, setDays] = useState([])

  function addMissingJobs(setOfDays) {
    if (Object.keys(setOfDays).length == 0) return;
    let arra = Object.keys(setOfDays).map(dstr => (new Date(dstr)).getTime());
    let d = Math.max(...arra);
    d = new Date(d)
    let today = new Date();
    d.setDate(d.getDate() + 1);
    while (d < today) {
      setOfDays[`${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)} 00:00:00`] = []
      d.setDate(d.getDate() + 1)
    }
    for (let day of Object.keys(setOfDays)) {
      for (let tjob of jobTemplates) {
        const jobs = setOfDays[day];
        const found = jobs.find(j => j.stage === tjob.stage && j.pipeline === tjob.pipeline);
        if (!found) {
          let newJob = {...tjob}
          newJob.startDate = day;
          jobs.push(newJob)
        }
      }
    }
  }
  useEffect(() => {
    let setOfDays = {}
    if (jobs && jobs.length) {
      for (let job of jobs) {
        setOfDays[job.startDate] = setOfDays[job.startDate] || [];
        setOfDays[job.startDate].push(job)
      }
    }
    addMissingJobs(setOfDays)
    console.log('setOfDays', setOfDays)
    setDays(setOfDays);
  }, [jobs]);

  return <Space style={{width: '100%'}}direction="vertical">
    <Title level={4}>Jobs</Title>
    {Object.keys(days).sort((d1, d2) => d2.localeCompare(d1)).map((d,idx) => <Pipeline key={idx} date={d} jobs={days[d]}/>)}
  </Space>
}

export default Overview
