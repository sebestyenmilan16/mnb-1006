import React from "react";
import './MnbCurrencyRates.css';

export default class MnbCurrencyRates extends React.Component{

    state = {
        date: '',
        rates: [],
        error: null,
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
                        <tbody></tbody>
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
                        <select name="from" ></select>
                    </label>
                    <button type="button"  title="Felcserélés">⇅</button>
                    <label>
                        Ebbe
                        <select name="to" ></select>
                    </label>
                    <output className="mnb-result"></output>
                </form>
            </div>
        </section>
    }

}