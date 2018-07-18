import React, {Component} from 'react';
import { Pagination, Button, Card, Grid, Icon, Image, Input} from 'semantic-ui-react';
import request from 'superagent';

export default class ProductView extends Component {
  constructor(props) {
   super(props);
   this.state = {
     activePage: 1,
     totalPages: 10,
     pageSize:20,
     productDetails:[],
     sku:'',
     search:false,
     errorText:""
   }
  }

  componentDidMount(){
    this.getData();
  }

  getData(){
    let count = 0;
    //let classObject = this;
    // this.setState({});
    request.get('http://localhost:3000/getProductCount').then((res,err)=>{
      let result = JSON.parse(res.text);
      count = result.count;
    }).then(()=>{
        request.post('http://localhost:3000/getProductDetails',{
          pageNumber:this.state.activePage,
          pageSize:this.state.pageSize
        }).then((response,err)=>{
          this.setState({
            totalPages:Math.ceil(count/this.state.pageSize),
            productDetails:JSON.parse(response.text),
            search:false,
            sku:""
          })
        })
    }).catch(err =>{
        console.log(err);
    })
  }

  onPageChange(e,data){
    request.post('http://localhost:3000/getProductDetails',{
      pageNumber:data.activePage,
      pageSize:this.state.pageSize
    }).then((response,err)=>{
      this.setState({
        activePage:data.activePage,
        productDetails:JSON.parse(response.text)
      })
    }).catch(err =>{
        console.log(err);
    })
  }

  searchSKU(){
    //console.log("sku value",this.state.sku);
    request.get('http://localhost:3000/getSKU').query({"sku":this.state.sku}).then((res, err)=>{
      if(res.text=="NA"){
        this.setState({errorText:"Specified item not found"})
      }
      else{
        let result = JSON.parse(res.text);
        var arr=[];
        arr.push(result);
        this.setState({productDetails:arr,search:true});
      }
      //console.log(result);
    })
  }


  render(){
    var searchButton = <Button onClick={this.searchSKU.bind(this)}>search</Button>
    if(this.state.search){
      searchButton = <Button onClick={this.getData.bind(this)}>Clear Search</Button>
    }

    return(
      <div>
        <center style={{marginTop:"2%"}}><h1>Shop karo</h1>
        <Input placeholder="Search by sku" value={this.state.sku} onChange={(e)=>{this.setState({sku:e.target.value,errorText:""})}} style={{marginRight:"1%"}}/>
        {searchButton}
        <p style={{color:"red"}}>{this.state.errorText}</p>
        </center>
        <Grid style={{marginTop:"5%"}}>
          <Grid.Row columns={5}>
          {
          this.state.productDetails.map((item, i)=>{
            var size = <div>
                        <span> Sizes :&nbsp;</span>
                        {
                        item.variants.map((type,j)=>{
                          if(type.size != ""){
                            return(
                              <span key={j}>
                                {type.size}&nbsp;
                              </span>
                            )
                          }
                      })
                    }
                    </div>

        var sku = <div>
                    <span> SKU :&nbsp;</span>
                    {
                    item.variants.map((type,j)=>{
                      if(type.size != ""){
                        return(
                          <span key={j}>
                            {type.sku.split('\'')[1]}&nbsp;
                          </span>
                        )
                      }
                  })
                }
                </div>

            return(
              <Grid.Column key={i} style={{marginBottom:"2%"}}>
              <Card>
              <Image src={item.variants[0].image} style={{width:"247px",height:"350px"}}/>
              <Card.Content>
                <Card.Header><center>{item.title}</center></Card.Header>
                <Card.Description>Price : <span>${item.variants[0].price}</span></Card.Description>
                <Card.Description>Colors : <Icon name="circle" style={{color:item.variants[0].color}}/></Card.Description>
                <Card.Description>{size} </Card.Description>
                <Card.Description>{sku} </Card.Description>
              </Card.Content>
              </Card>
              </Grid.Column>
            );
          })
        }
        </Grid.Row>
        </Grid>
        {this.state.search? " " :
        <center><Pagination
          pointing
          secondary
          defaultActivePage={this.state.activePage}
          totalPages={this.state.totalPages}
          onPageChange={this.onPageChange.bind(this)}
        /></center>}
      </div>
    )
  }
}
