import React from 'react';
import '../Styles/home.css';

import QuickSearchItem from './QuickSearchItem';

class QuickSearch extends React.Component {

    render() {
        const { mealtypes } = this.props;
        return (
            <div style={{'font-family': 'Poppins'}}> 

                <div className="quicksearch">
                    <p className="quicksearchHeading">
                        Quick Searches
                </p>
                    <p className="quicksearchSubHeading mt-n2">
                        Discover restaurants by type of meal
                </p>

                    <div className="container-fluid">
                        <div className="row">

                            
                            {
                                mealtypes.map((item) => {
                                    return <QuickSearchItem item={item} />
                                })
                            }
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default QuickSearch;