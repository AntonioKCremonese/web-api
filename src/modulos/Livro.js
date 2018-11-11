import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from '../components/InputCustomizado';
import PubSub from 'pubsub-js';
import TratamentoErro from '../modulos/TratamentoErro';

class FormularioLivro extends Component {
    constructor() {
        super();
        this.state = { titulo: '', preco: '', autorId: '' }
        this.enviaForm = this.enviaForm.bind(this);
        this.onChange = this.onChange.bind(this);

    }

    enviaForm(evento) {
        evento.preventDefault();
        $.ajax({
            url: "https://cdc-react.herokuapp.com/api/autores",
            contentType: 'application/json',
            dataType: "json",
            type: 'post',
            data: JSON.stringify({ titulo: this.state.titulo, preco: this.state.preco, autorId: this.state.autorId }),
            success: (novaListagem) => {
                PubSub.publish('atualiza-lista-autores', novaListagem);
                this.setState({ titulo: '', preco: '', autorId: '' });
            },
            error: (erro) => {
                if (erro.status === 400) {
                    new TratamentoErro().publicaErro(erro.responseJSON);
                }

            },
            beforeSend: () => {
                PubSub.publish('limpa-erros', {});
            }
        });
    }

    onChange(evento) {
        this.setState({
            [evento.target.id]: evento.target.value
        });
    }

    render() {
        return (

            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                    <fieldset>
                        <InputCustomizado name="titulo" nomeLabel="Titulo" id="titulo" type="text" placeholder="Titulo" value={this.state.titulo} onChange={this.onChange} />
                        <InputCustomizado name="preco" nomeLabel="Preço" id="preco" type="text" placeholder="Ex: 10.20" value={this.state.preco} onChange={this.onChange} />
                        <div className="pure-control-group">
                        <label htmlFor="autorId">Autor</label>
                            <select value={ this.state.autorId } name="autorId" id="autorId" onChange={ this.onChange }>
                                <option value="">Selecione Um Autor</option>
                                { 
                                    this.props.autores.map(function(autor) {
                                    return <option key={ autor.id } value={ autor.id }>
                                                { autor.nome }
                                        </option>;
                                    })
                                }
                            </select>
                        </div>

                        <div className="pure-controls">
                            <button type="submit" className="pure-button pure-button-primary">Gravar</button>
                        </div>
                    </fieldset>
                </form>
            </div>

        )
    }
}

class TabelaLivros extends Component {

    render() {
        return (
            <table className="pure-table pure-table-horizontal">
                <thead>
                    <tr>
                        <th>Titulo</th>
                        <th>Preço</th>
                        <th>Autor</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        this.props.lista.map((livro) => {
                            return (
                                <tr key={livro.id}>
                                    <td>{livro.titulo}</td>
                                    <td>{livro.preco}</td>
                                    <td>{livro.autor.nome}</td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        )
    }
}

export default class LivroBox extends Component{
    constructor(){
        super();
        this.state={lista:[],autores:[]}
    }

    componentDidMount() {

        $.ajax({
            url: "https://cdc-react.herokuapp.com/api/livros",
            dataType: 'json',
            success: (resposta) => {
                this.setState({ lista: resposta });
            }
        });
        $.ajax({
            url:"https://cdc-react.herokuapp.com/api/autores",
            dataType: 'json',
            success:(autores)=>{
              this.setState({autores:autores});
            }
          });

        PubSub.subscribe('atualiza-lista-autores', (topico, novaListagem) => {
            this.setState({ lista: novaListagem });
        })
    };
    
    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de livros</h1>
                </div>
                <div className="content" id="content">
                    <FormularioLivro autores={this.state.autores}/>
                    <TabelaLivros lista={this.state.lista}/>
                </div>
            </div>
        )
    }
}