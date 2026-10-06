import React from "react";
import './MnbCurrencyRates.css';

export default class MnbCurrencyRates extends React.Component{

    state = {
        date: '',
        rates: [],
        error: null,
    }

    async componentDidMount() {

        try {
            // call GET /api/rates HTTP REST API endpoint
        const res = await fetch('/api/rates')
        const json = await res.json()
        console.log('MnbCurrencyRates json: ', json)
        const {date = new Date(Date.now()), rates = []} = json

        // Set state from request
        this.setState({date, rates, error: null})

        }
        catch {
            console.warn(error)
            this.setState({error, date: '', rates: []})
        }
        


    }

    render() {

        const {date, rates, error} = this.state;

        return <section className="mnb">

            {error && <p className="mnb-error">Hiba: error</p>}

            <div className="mnb-layout">
                <div className="mnb-table-wrap">
                    <table className="mnb-table">
                        <thead>
                            <tr>
                                <th>Deviza</th>
                                <th>Egység</th>
                                <th>Árfolyam (HUF)</th>
                            </tr>
                        </thead>
                        <tbody>{
                            rates.map( (rate) => <tr key={rate.curr}>
                                <td>{rate.curr}</td>
                                <td>{rate.unit}</td>
                                <td>{rate.value}</td>
                            </tr>)
                            }</tbody>
                    </table>
                </div>

                <form className="mnb-form" >
                    <h3>Átváltó</h3>
                    <label>
                        Összeg
                        <input type="number" name="amount" min="0" step="any" />
                    </label>
                    <label>
                        Ebből
                        <select name="from" >TODO - fill options
                            rates.map( (rate) = <option key={rate.curr}>{rate.curr}</option> )
                        </select>
                    </label>
                    {/* TODO - button click */}
                    <button type="button"  title="Felcserélés">⇅</button>
                    <label>
                        Ebbe
                        <select name="to" >TODO - fill options</select>
                    </label>
                    <output className="mnb-result"></output>
                </form>
            </div>
        </section>
    }

}