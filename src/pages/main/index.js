import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';
import "./styles.css";
import Chat from '../../components/chat';

function Main() {
    const defaultState = {
        docs: [],
        productInfo: {},
        page: 1,
    };
    const [state, setState] = useState(defaultState);
    useEffect(()=> loadProducts(), []);
    const { docs, page, productInfo } = state;

    async function loadProducts (page = 1){
        await api.get(`/products?page=${page}`).then(response =>{
            var { docs = [], ...productInfo } = response.data;
            if (docs[0]._id) {
                docs.map((product,index) =>{
                    product.id = product._id;
                    docs.splice(index, 1, product);
                });
            };
            setState({ docs, productInfo, page});
            document.getElementsByClassName('loading')[0].classList.add('hidden');
        }).catch(err =>{
            console.log(err);
            alert("Não foi possível conectar a API!");
        })
    }
    function prevPage() {
        if (page === 1) return;

        const pageNumber = page - 1;

        loadProducts(pageNumber);
    };
    function nextPage (){
        if (page === productInfo.totalPages) return;
        
        const pageNumber = page + 1;

        loadProducts(pageNumber);
            
    };
    
    return (
        <div className='product-list'>
            {docs.map(product => (
                <article key={product.id}>
                    <strong>{product.title}</strong>
                    <p>{product.description}</p>
                    <Link to={`/products/${product.id}`}>Acessar</Link>
                </article>
            ))}
            <div className="actions">
                <button disabled={page === 1} onClick={prevPage}>Anterior</button>
                <button disabled={page === productInfo.totalPages} onClick={nextPage}>Próxima</button>
            </div>
            <Chat />
            <div className="loading">
                <div className="loadingCircle"></div>
                <h1>Acessando a API</h1>
            </div>
        </div>
    )};
export default Main;