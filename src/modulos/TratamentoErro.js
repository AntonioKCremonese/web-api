import React, { Component } from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';

export default class TratamentoErro extends Component {

    publicaErro(erro) {

        for (var i = 0; i < erro.errors.length; i++) {
            PubSub.publish('erro-validacao', erro.errors[i]);
        }
    }

}