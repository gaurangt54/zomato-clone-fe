/* eslint-disable no-whitespace-before-property */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react";
import "../Styles/details.css";
import queryStyring from "query-string";
import axios from "axios";
import Modal from "react-modal";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Header from './Header'

const H = Header



const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        height: "500px",
        border: "black solid 2px",
        backgroundColor: "brown",
        'font-family': 'Poppins'
    },
};

class Details extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurant: {},
            galleryModalIsOpen: false,
            orderModalIsOpen: false,
            formModalIsOpen: false,
            restaurantId: undefined,
            menuItems: [],
            subTotal: 0,
            userName: undefined,
            contactNumber: undefined,
            address: undefined,
            email: undefined
        };
    }

    componentDidMount() {
        const qs = queryStyring.parse(this.props.location.search);
        const resId = qs.restaurant;
        console.log(resId)
        axios({
            url: `https://ght-zomato-backend.herokuapp.com/getRestaurantById/${resId}`,
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => {
                console.log(res)
                this.setState({
                     restaurant: res.data.restaurants,
                     restaurantId: resId,
                     });

            })
            .catch((err) => console.log(err));
    }

    handleClick = (state, value) => {
        const {restaurantId} = this.state;
        this.setState({ [state]: value });
        if (state == 'orderModalIsOpen'){
            axios({
                url: `https://ght-zomato-backend.herokuapp.com/getItemByRestaurant/${restaurantId}`,
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
            .then((res)=> {
                console.log(res);
                this.setState({
                    menuItems: res.data.items
                })
            })
            .catch((err) => console.log(err));     
        }
        else if (state == 'formModalIsOpen') {
            this.setState({ orderModalIsOpen: false });
        }
    }

    handleModalClose = (state) => {
        this.setState({[state]:false})
    }

    handleInputChange = (event, state) => {
        this.setState({ [state]: event.target.value })
    }

    addItems = (index, operationType) => {
        let total = 0;
        const items = [...this.state.menuItems];
        const item = items[index];

        if (operationType == 'add') {
            item.qty = Number(item.qty) + 1;
        }
        else {
            item.qty = item.qty - 1;
        }
        items[index] = item;
        items.map((item) => {
            total += item.qty * item.price;
        })
        this.setState({ menuItems: items, subTotal: total });
    }

    isDate(val) {
        // Cross realm comptatible
        return Object.prototype.toString.call(val) === '[object Date]'
    }

    isObj = (val) => {
        return typeof val === 'object'
    }

    stringifyValue = (val) => {
        if (this.isObj(val) && !this.isDate(val)) {
            return JSON.stringify(val)
        } else {
            return val
        }
    }

    buildForm = ({ action, params }) => {
        const form = document.createElement('form')
        form.setAttribute('method', 'post')
        form.setAttribute('action', action)

        Object.keys(params).forEach(key => {
            const input = document.createElement('input')
            input.setAttribute('type', 'hidden')
            input.setAttribute('name', key)
            input.setAttribute('value', this.stringifyValue(params[key]))
            form.appendChild(input)
        })

        return form
    }

    post = (details) => {
        const form = this.buildForm(details)
        document.body.appendChild(form)
        form.submit()
        form.remove()
    }

    getData = (data) => {
        return fetch(`https://ght-zomato-backend.herokuapp.com/payment`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => response.json()).catch(err => console.log(err))
    }

    makePayment = (e) => {
        const { subTotal, email } = this.state;
        this.getData({ amount: subTotal, email: email }).then(response => {
            var information = {
                action: "https://securegw-stage.paytm.in/order/process",
                params: response
            }
            this.post(information);
        })
        e.preventDefault();
    }

    

    render() {
        const { restaurant, galleryModalIsOpen, orderModalIsOpen, menuItems, subTotal, formModalIsOpen,
        userName, contactNumber, email, address  } = this.state;
        return (
            <div>
                <div>
                    <img
                        src={`../${restaurant.image}`}
                        alt="No Image, Sorry for the Inconvinience"
                        width="100%"
                        height="350"
                    />
                    <button
                        className="button"
                        onClick={() =>
                            this.handleClick("galleryModalIsOpen", true)
                        }
                    >
                        Click to see Image Gallery
                    </button>
                </div>
                <div className="heading">{restaurant.name}</div>
                <button
                    className="btn-order"
                    onClick={() => this.handleClick("orderModalIsOpen", true)}
                >
                    Place Online Order
                </button>

                <div className="tabs">
                    <div className="tab">
                        <input
                            type="radio"
                            id="tab-1"
                            name="tab-group-1"
                            checked
                        />
                        <label for="tab-1">Overview</label>

                        <div className="content">
                            <div className="about">About this place</div>
                            <div className="head">Cuisine</div>
                            <div className="value">
                                {restaurant && restaurant.cuisine
                                    ? restaurant.cuisine.map(
                                          (item) => `${item.name}, `
                                      )
                                    : null}
                            </div>
                            <div className="head">Average Cost</div>
                            <div className="value">
                                &#8377; {restaurant.min_price} for two
                                people(approx)
                            </div>
                        </div>
                    </div>

                    <div className="tab">
                        <input type="radio" id="tab-2" name="tab-group-1" />
                        <label for="tab-2">Contact</label>

                        <div className="content">
                            <div className="head">Phone Number</div>
                            <div className="value">
                                {restaurant.contact_number}
                            </div>
                            <div className="head">{restaurant.name}</div>
                            <div className="value">{`${restaurant.locality}, ${restaurant.city}`}</div>
                        </div>
                    </div>
                </div>
                <Modal isOpen={galleryModalIsOpen} style={customStyles}>
                    <div>
                        <div
                            className="btn btn-danger"
                            style={{ float: "right" }}
                            onClick={() =>
                                this.handleClick("galleryModalIsOpen", false)
                            }
                        >
                            Close
                        </div>
                        <Carousel showThumbs={false} showIndicators={false}>
                            {restaurant && restaurant.thumb
                                ? restaurant.thumb.map((item) => {
                                      return (
                                          <div>
                                              <img src={`../${item}`} height="400px"/>
                                          </div>
                                      );
                                  })
                                : null}
                        </Carousel>
                    </div>
                </Modal>
                <Modal isOpen={orderModalIsOpen} style={customStyles}>
                <div >
                        <div className="glyphicon glyphicon-remove lose" style={{ float: 'right' }} onClick={() => this.handleClick('orderModalIsOpen',false)}>x</div>
                        <h3 className="restaurant-name">{restaurant.name}</h3>
                        <h3>SubTotal : {subTotal}</h3>
                        <button className="btn btn-danger pay" onClick={() => this.handleClick('formModalIsOpen', true)}> Pay Now</button>
                        {menuItems.map((item, index) => {
                            return <div style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', borderBottom: '2px solid #dbd8d8' }}>
                                <div className="card" style={{ width: '43rem', margin: 'auto' }}>
                                    <div className="row" style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                        <div className="col-xs-9 col-sm-9 col-md-9 col-lg-9 " style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                            <span className="card-body">
                                                <h5 className="item-name">{item.name}</h5>
                                                <h5 className="item-name">&#8377;{item.price}</h5>
                                                <p className="card-text">{item.description}</p>
                                            </span>
                                        </div>
                                        <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3"> <img className="card-img-center title-img" src={`../${item.image}`} style={{ height: '75px', width: '75px', 'border-radius': '20px' }} />
                                            {item.qty == 0 ? <div><button className="add-button btn btn-primary" onClick={() => this.addItems(index, 'add')}>Add</button></div> :
                                                <div className="add-number btn-grp"><button className="btn btn-primary" onClick={() => this.addItems(index, 'subtract')}>-</button><span className="btn btn-primary" >{item.qty}</span><button className="btn btn-primary" onClick={() => this.addItems(index, 'add')}>+</button></div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })}
                        
                    </div>
                </Modal>
                <Modal
                    isOpen={formModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <div className="glyphicon glyphicon-remove lose" style={{ float: 'right' }} onClick={() => this.handleClick('formModalIsOpen',false)}>x</div>
                        <br/>
                        <form onSubmit={this.makePayment}>
                            <table>
                                <tr>
                                    <td>Name</td>
                                    <td><input type="text" value={userName} onChange={(event) => this.handleInputChange(event, 'userName')} /></td>
                                </tr>
                                <tr>
                                    <td>Conatct Number</td>
                                    <td><input type="text" value={contactNumber} onChange={(event) => this.handleInputChange(event, 'contactNumber')} /></td>
                                </tr>
                                <tr>
                                    <td>Address</td>
                                    <td><input type="text" value={address} onChange={(event) => this.handleInputChange(event, 'address')} /></td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td><input type="text" value={email} onChange={(event) => this.handleInputChange(event, 'email')} /></td>
                                </tr>
                            </table>
                            <input type="submit" className="btn btn-danger" value="Proceed" />
                        </form>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default Details;
