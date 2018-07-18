import React, {Component} from 'react';
import { Button } from 'semantic-ui-react';
import FileUploadProgress  from 'react-fileupload-progress';
import request from 'superagent';
import ProductView from './productView/productView.jsx'

export default class App extends Component {
  constructor(props) {
   super(props);
 }
convertToJson(){
  request.post("/convertToJson").send().end((err, res) => {
  if(res.text == "success")
    console.log("successfully converted");
  });
}
listAllProducts(){
  request.get('http://localhost:3000/productDetails').end((err,res)=>{
    console.log("response",res.text);
  });
}
  render() {
    return (
      <div className='App'>
       <ProductView />
      </div>
    );
  }
}
