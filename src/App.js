import React, { useState } from "react";
import './App.css';
import { InputField } from './components/InputField';
import axios from 'axios';
import ContributionsChart from "./components/ContributionsChart";
import Tables from "./components/Table";
import BarChart from "./components/FloatingBars";
import  { HorizontalBars } from "./components/HorizontalBars";
const mockData = [
  { date: '2023-02-15', count: 1 },
  { date: '2023-01-01', count: 12 },
  { date: '2023-01-22', count: 122 },
  { date: '2023-01-30', count: 38 },
];

function App() {
  const [inputValue, setInputValue] = useState({ jiraId: "", mergeId: ""  });
  const { jiraId, mergeId } = inputValue;
  const [jiraApiResponse, setJiraApiResponse] = useState(null);
  const [gitApiResponse, setGitApiResponse] = useState(null);
  const [selectedGender, setSelectedGender] = useState("Select");
  // const [chartData, setChartData] = useState([]);
  let input = !(jiraId.length && mergeId.length);
  let mrId="";

  const handleDropddown=(e)=>{
    let updatedval=e.target.value
    setSelectedGender(e.target.value);
    handleApi(updatedval)
  }

  const handleApi = updatedval => { 
    // axios.get(`https://mocki.io/v1/654a4d2c-c74e-4e47-8812-eefcafdb9717`) 
        axios.get(`http://10.5.20.6:3022/api/issues/id?issueID=${updatedval}`,{
          headers: {
              "redhawk-token": "test"
          }
        }
        )
          .then((response) => {
            // setChartData(mockData);
            setJiraApiResponse(response.data);
            mrId = response.data.repo_url
            console.log("mrid::",mrId);
            console.log("res0::",response.data);
            response.data ? console.log(response.data):console.log("no data");
            // console.log(response.data.gitlab_data);
          })
          .catch((error) => {
            console.error('API call error:', error);
          }); 

       setTimeout(function() {
        axios.get(`http://10.5.20.6:3022/api/git/merge/commits?url=${mrId}`,{
          headers :{
            "redhawk-token":"test"
          }
        })
        .then((response) =>{
          setGitApiResponse(response.data);
        })
      }, 1000);
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setInputValue((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };
  // let count =chartData.map(user=>user.count);
  // let date=chartData.map(user=>user.date);
  // const titleForValue = () => {
  //   if (count && date) {
  //     return `Date: ${date}\nContributions: ${count}`;
  //   }
  //   return 'No data for this date';
  // };

  // const tooltipDataAttrs = () => {
  //   return {
  //     'data-date': date,
  //     'data-contributions': count
  //   };
  // };

// console.log(mockData.map(user=>user.date));
let dates= gitApiResponse ?gitApiResponse.map(user=>user.date) :null;
let counts= gitApiResponse ?gitApiResponse.map(user=>user.count) :null;
console.log("jira",jiraId);
console.log(gitApiResponse);
console.log("dateus",dates);
console.log("count",counts);
console.log("selectedGender",selectedGender);
const gender = ["Select", "SGMY-4077","SGMY-3485"];
const genderArr=gender.map((val,i) =>
<option key={i} value={val}>{val}</option>
)
  return (
    <div className="App">
<div style={{marginLeft:"2%",fontSize:"16px",fontWeight:"600"}}><span>Jira Id</span></div>
<select className="select" value={selectedGender} onChange={handleDropddown}> {genderArr}</select> 
      {/* <InputField
         type="text"
         value1={jiraId}
         placeholder="Enter your jira id"
         name="jiraId"
         onChange={handleChange}
       />
       <InputField
         type="text"
         value2={mergeId}
         placeholder="Enter your merge id"
         name="mergeId"
         onChange={handleChange}
       /> */}
       {/* <button className="btn" disabled={input} onClick={handleApi}>Submit</button> */}
       <div className="apiResponseContainer">
       {jiraApiResponse ? <div className="jiraContainer"> 
        <div><span>Dev Assignee :</span>{jiraApiResponse.dev_assignee }</div>
        <div><span>Dev Effort :</span>{jiraApiResponse.dev_effort }</div>
        <div><span>Dev StartDate :</span>{jiraApiResponse.dev_start_date ?jiraApiResponse.dev_start_date:"2023-09-29"}</div>
        <div><span>Build DropDate :</span>{jiraApiResponse.build_drop_date }</div>
       </div>
       :null }
      {/* { gitApiResponse ? <div className="gitContainer"> 
      <div className="commitDate"><span>Commit Date :</span>{gitApiResponse.map(user=>user.date) }</div> */}
      {/* <div className="commitContent">
        <div><span>Commit message :</span>{gitApiResponse.commitMessage }</div>
        <div><span>Dev Name :</span>{gitApiResponse.name }</div>
      </div> */}
       {/* <div><span>No of commits :</span>{gitApiResponse.map(user=>user.count)}</div>
      </div>:null}
        */}
       </div>

       {/* <ContributionsChart data={chartData} tooltipDataAttrs={tooltipDataAttrs} titleForValue={titleForValue}/> */}
       {/* <Tables/> */}
       <BarChart dates={dates} counts={counts}/>
       <HorizontalBars count={counts}/>
    </div>
  );
}

export default App;
