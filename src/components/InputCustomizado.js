import React,{ Component } from 'react';

export default class InputCoustomizado extends Component {

    render() {

        return (

            <div className="pure-control-group">
                <label htmlFor={this.props.id}>{this.props.nomeLabel}</label>
                <input id={this.props.id} type={this.props.type} placeholder={this.props.placeholder} value={this.props.value} onChange={this.props.onChange}/>
            </div>
        )
    }

}