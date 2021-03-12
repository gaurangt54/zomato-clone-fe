/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import '../Styles/filter.css';
import querystring from 'query-string';
import axios from 'axios';





class Filter extends React.Component {

    constructor(){
        super();
        this.state = {
            locations: [],
            restaurants: [],
            mealtype: undefined,
            location: undefined,
            cuisine: [],
            lcost : undefined,
            hcost: undefined,
            sort: undefined,
            pages: [],
            page: undefined,
            mealtypes:{
                "1":"BreakFast",
                "2":"Lunch",
                "3":"Dinner",
                "4":"Snacks",
                "5":"Drinks",
                "6":"Nightlife"
            },
            cusines:{
                0:false,
                1:false,
                2:false,
                3:false,
                4:false
            }
        }
        
    }

    

    handleClick = (resId) => {
        this.props.history.push(`/details/?restaurant=${resId}`);
    }

    

    handleSort = (sort) => {
        const {mealtype, location , lcost, hcost, cuisine} = this.state;
        axios({
            method: 'POST',
            url: 'https://ght-zomato-backend.herokuapp.com/filter',
            headers: { 'Content-Type': 'application/json' },
            data: {
                mealtype: mealtype,
                location: location,
                sort: sort,
                lcost: lcost,
                hcost: hcost
            }
        }).then(res => {
            console.log(res)
            this.setState({
                restaurants: res.data.restaurants,
                mealtype: mealtype,
                location: location,
                sort: sort,
                lcost: lcost,
                hcost: hcost,

            })
        }).catch(err => {
            console.log(err)
        })

    }

    handleCost = (lcost,hcost) => {
        const { mealtype, location, sort, cuisine} = this.state;
        axios({
            method: 'POST',
            url: 'https://ght-zomato-backend.herokuapp.com/filter',
            headers: { 'Content-Type': 'application/json' },
            data: {
                mealtype: mealtype,
                location: location,
                sort: sort,
                lcost: lcost,
                hcost: hcost
            }
        }).then(res => {
            this.setState({
                restaurants: res.data.restaurants,
                mealtype: mealtype,
                location: location,
                sort: sort,
                lcost: lcost,
                hcost: hcost,
            })
        }).catch(err => {
            console.log(err)
        })

    }

    handleCuisine = (cuisine_id) => {
        
        const { mealtype, location, sort, lcost, hcost, cusines} = this.state;
        
        let cu = cusines;

        cu[cuisine_id] ? cu[cuisine_id]=false : cu[cuisine_id] =true;

        let c = []

        for(let i=0;i<5;i++){
            if(cu[i] == true){
                c.push({id:i})
            }
        }


        axios({
            method: 'POST',
            url: 'https://ght-zomato-backend.herokuapp.com/filter',
            headers: { 'Content-Type': 'application/json' },
            data: {
                mealtype: mealtype,
                location: location,
                sort: sort,
                lcost: lcost,
                hcost: hcost,
                cuisine: c,
                cusines: cu
                
            }
        }).then(res => {
            console.log(res)
            this.setState({
                restaurants: res.data.restaurants,
                mealtype: mealtype,
                location: location,
                sort: sort,
                lcost: lcost,
                hcost: hcost,
                cuisine: c,
                cusines: cu
        })
    }).catch(err => {
            console.log(err)
        })



    }


    handlePage = (pageNo) => {
        const {mealtype, location , lcost, hcost, sort} = this.state;
        axios({
            method: 'POST',
            url: 'https://ght-zomato-backend.herokuapp.com/filter',
            headers: { 'Content-Type': 'application/json' },
            data: {
                mealtype: mealtype,
                location: location,
                sort: sort,
                lcost: lcost,
                hcost: hcost,
                page: pageNo
            }
        }).then(res => {
            console.log(res)
            this.setState({
                restaurants: res.data.restaurants,
                mealtype: mealtype,
                location: location,
                sort: sort,
                lcost: lcost,
                hcost: hcost,
                page: pageNo

            })
        }).catch(err => {
            
            console.log(err)
        })

    }

    handleLocation = (event) => {
        const {mealtype, lcost, hcost, sort} = this.state;
        const location = event.target.value;
        console.log(location)
        axios({
            url:'https://ght-zomato-backend.herokuapp.com/filter',
            method:'POST',
            headers:{'Content-Type':'application/json'},
            data: {
                mealtype: mealtype,
                location: location,
                sort: sort,
                lcost: lcost,
                hcost: hcost,
            }
        }).then(res => {
            console.log(res)
            this.setState({
                restaurants: res.data.restaurants,
                mealtype: mealtype,
                location: location,
                sort: sort,
                lcost: lcost,
                hcost: hcost,

            })
        }).catch(err => {
            console.log(err)
        })
    }

    componentDidMount(){
        const qs = querystring.parse(this.props.location.search);
        const {mealtype, area} = qs;
        console.log(area)

        axios({
            url:'https://ght-zomato-backend.herokuapp.com/location',
            method:'GET',
            headers:{'Content-Type':'application/json'}
        }).then(res=>{
            this.setState({locations:res.data.locations})
        }).catch(err=> {console.log(err)})

        axios({
            method:'POST',
            url:'https://ght-zomato-backend.herokuapp.com/filter',
            headers: { 'Content-Type': 'application/json' },
            data:{
                mealtype:mealtype,
                location:area
            }
        }).then(res=> {
            console.log(res)
            console.log(res.data.restaurants.length)
            console.log(Math.ceil(res.data.total.length/2))
            const pagination = (n) => {
                let no = []
                for(let i =1; i<=n;i++){
                    no.push(i)
                }
                return(no);
            }
            this.setState({
                restaurants: res.data.restaurants,
                mealtype: mealtype,
                location: area,
                pages: pagination(Math.ceil(res.data.total.length/2))

            })
        }).catch(err=>{
            console.log(err)
        })

    }

    render() {
        const {restaurants, pages, page, location, locations, mealtypes, mealtype} = this.state;
        return (
            <div>

                <div id="myId" className="heading">{mealtypes[mealtype]} Places</div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-4 col-md-4 col-lg-4 filter-options">
                            <div className="filter-heading">Filters / Sort</div>
                            <span className="glyphicon glyphicon-chevron-down toggle-span" data-toggle="collapse"
                                data-target="#filter"></span>
                            <div id="filter" className="collapse show">
                                <div className="Select-Location ">Select Location</div>
                                <select className="Rectangle-2236 " onChange={this.handleLocation}>
                                <option value="0">Select</option>
                                {
                                    locations.map((item) => {
                                        return <option value={item.location_id}>{`${item.name}, ${item.city}`}</option>
                                    })
                                }
                                </select>
                                <div className="Cuisine">Cuisine</div>
                                <div>
                                    <input type="checkbox" onChange={() => { this.handleCuisine(1) }}/>
                                    <span className="checkbox-items">North Indian</span>
                                </div>
                                <div>
                                    <input type="checkbox" onChange={() => { this.handleCuisine(2) }}/>
                                    <span className="checkbox-items">South Indian</span>
                                </div>
                                <div>
                                    <input type="checkbox" onChange={() => { this.handleCuisine(3) }}/>
                                    <span className="checkbox-items">Chineese</span>
                                </div>
                                <div>
                                    <input type="checkbox" onChange={() => { this.handleCuisine(4) }}/>
                                    <span className="checkbox-items">Fast Food</span>
                                </div>
                                <div>
                                    <input type="checkbox" onChange={() => { this.handleCuisine(0) }}/>
                                    <span className="checkbox-items">Street Food</span>
                                </div>
                                <div className="Cuisine">Cost For Two</div>
                                <div>
                                    <input type="radio" name="cost" onChange={()=> {this.handleCost(1,500)}}/>
                                    <span className="checkbox-items">Less than &#8377; 500</span>
                                </div>
                                <div>
                                    <input type="radio" name="cost" onChange={() => { this.handleCost(500, 1000) }} />
                                    <span className="checkbox-items">&#8377; 500 to &#8377; 1000</span>
                                </div>
                                <div>
                                    <input type="radio" name="cost" onChange={() => { this.handleCost(1000, 1500) }}/>
                                    <span className="checkbox-items">&#8377; 1000 to &#8377; 1500</span>
                                </div>
                                <div style={{ display: 'block' }}>
                                    <input type="radio" name="cost" onChange={() => { this.handleCost(1500, 2000) }}/>
                                    <span className="checkbox-items">&#8377; 1500 to &#8377; 2000</span>
                                </div>
                                <div>
                                    <input type="radio" name="cost" onChange={() => { this.handleCost(2000, 5000) }}/>
                                    <span className="checkbox-items">&#8377; 2000 +</span>
                                </div>
                                <div>
                                    <input type="radio" name="cost" onChange={() => { this.handleCost(1, 5000) }}/>
                                    <span className="checkbox-items">All Ranges Allowed</span>
                                </div>
                                <div className="Cuisine">Sort</div>
                                <div>
                                    <input type="radio" name="sort" onChange={() => {this.handleSort(1)} }/>
                                    <span className="checkbox-items">Price low to high</span>
                                </div>
                                <div>
                                    <input type="radio" name="sort" onChange={() => { this.handleSort(-1) }}/>
                                    <span className="checkbox-items">Price high to low</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-8 col-md-8 col-lg-8">

                            {restaurants.length !=0 ?
                             restaurants.map((item) => {
                                return (
                                <div className="Item" onClick={() => {this.handleClick(item._id)}}>
                                    <div>
                                        <div className="small-item vertical">
                                            <img className="img" src={`../${item.image}`} />
                                        </div>
                                        <div className="big-item">
                                            <div className="rest-name">{item.name}</div>
                                            <div className="rest-location">{item.city}</div>
                                            <div className="rest-address">{item.locality}</div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div>
                                        <div className="margin-left">
                                            <div className="Bakery">CUISINES : {
                                                item && item.cuisine ?
                                                item.cuisine.map((i) => { return `${i.name}, `}):
                                                null
                                            }</div>
                                            <div className="Bakery">COST FOR TWO : &#8377; {item.min_price} </div>
                                        </div>
                                    </div>
                                </div>
                                )

                            })
                            : <h1>No Records Found!</h1>
                        }


                            <div className="pagination">
                            <a onClick={() => {this.handlePage(page-1)}}>&laquo;</a>
                                {pages.map((i) => {
                                    return <a onClick={() => {this.handlePage(i)}}>{i}</a>
                                })}
                            <a onClick={() => {this.handlePage(page+1)}}>&raquo;</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Filter;


