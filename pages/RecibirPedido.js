import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';  // Cambio aquí
import BarcodeReader from 'react-barcode-reader';
import styles from './PanelPedido.module.css';
import Navbar from './navbar';

const PanelPedidos = () => {
  const [pedidoId, setPedidoId] = useState('');
  const [pedidoInfo, setPedidoInfo] = useState(null);
  const [productoIndex, setProductoIndex] = useState(0);
  const [codigoValido, setCodigoValido] = useState([]);
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [entregaConfirmada, setEntregaConfirmada] = useState(false);

  // Simulando una base de datos de pedidos
  const pedidos = [
    {
      id: '12345',
      origen: 'Chihuahua',
      destino: 'Pumas',
      productos: [
        { nombre: 'Producto A', cantidad: 5, codigo: 'A123' },
        { nombre: 'Producto B', cantidad: 3, codigo: 'B123' },
      ],
    },
    {
      id: '67890',
      origen: 'Cantera',
      destino: 'Rosalio',
      productos: [
        { nombre: 'Producto C', cantidad: 2, codigo: 'C123' },
        { nombre: 'Producto D', cantidad: 7, codigo: 'D123' },
      ],
    },
  ];

  const handleQRCodeScan = (data) => {
    if (data) {
      setPedidoId(data); // Aquí asignas el ID del pedido desde el QR
    }
  };

  const handleBarcodeScan = (data) => {
    if (data) {
      const currentProducto = pedidoInfo.productos[productoIndex];
      if (data === currentProducto.codigo) {
        setCodigoValido([...codigoValido, data]);

        // Verificar si todos los códigos para ese producto han sido validados
        if (codigoValido.length + 1 === currentProducto.cantidad) {
          if (productoIndex + 1 < pedidoInfo.productos.length) {
            setProductoIndex(productoIndex + 1);
            setCodigoValido([]); // Reset para el siguiente producto
          } else {
            setEntregaConfirmada(true);
          }
        }
      }
    }
  };

  const buscarPedido = () => {
    const pedido = pedidos.find((p) => p.id === pedidoId);
    if (pedido) {
      setPedidoInfo(pedido);
    } else {
      alert('Pedido no encontrado');
    }
  };

  const confirmarEntrega = () => {
    if (usuario && password) {
      // Aquí puedes validar el usuario y la contraseña
      // Esto es solo un ejemplo, debes integrar un sistema real de autenticación
      alert('Entrega confirmada');
      setEntregaConfirmada(false);
      setPedidoId('');
      setPedidoInfo(null);
    } else {
      alert('Por favor ingresa usuario y contraseña');
    }
  };

  return (
    <div>
        <Navbar />
        <div className={styles.panelContainer}>
        <h3>Panel de Recepción de Pedidos</h3>

        {/* 1. Escaneo de QR o Ingreso del Número de Pedido */}
        {!pedidoId ? (
            <div>
            <h4>Escanea el QR o Ingresa el Número del Pedido</h4>
            <QrReader
                delay={300}
                style={{ width: '100%' }}
                onError={(err) => console.error(err)}
                onScan={handleQRCodeScan}
            />
            <div className={styles.inputContainer}>
                <input
                type="text"
                placeholder="Ingresa el número de pedido"
                value={pedidoId}
                onChange={(e) => setPedidoId(e.target.value)}
                />
                <button onClick={buscarPedido}>Buscar Pedido</button>
            </div>
            </div>
        ) : (
            // 2. Mostrar Información del Pedido
            pedidoInfo && (
            <div>
                <h4>Pedido ID: {pedidoInfo.id}</h4>
                <p>Origen: {pedidoInfo.origen}</p>
                <p>Destino: {pedidoInfo.destino}</p>
                <h5>Productos:</h5>
                <ul>
                {pedidoInfo.productos.map((producto, index) => (
                    <li key={index}>
                    {producto.nombre} - Cantidad: {producto.cantidad}
                    </li>
                ))}
                </ul>

                {/* 3. Confirmación de Productos Recibidos */}
                {productoIndex < pedidoInfo.productos.length && !entregaConfirmada && (
                <div>
                    <h5>Escanea el Código de Barras para {pedidoInfo.productos[productoIndex].nombre}</h5>
                    <BarcodeReader onScan={handleBarcodeScan} />
                    <p>
                    {codigoValido.length} de {pedidoInfo.productos[productoIndex].cantidad} códigos validados.
                    </p>
                </div>
                )}

                {/* 4. Confirmación de Entrega */}
                {entregaConfirmada && (
                <div>
                    <h5>Confirmar Entrega</h5>
                    <div>
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={confirmarEntrega}>Confirmar Entrega</button>
                    </div>
                </div>
                )}
            </div>
            )
        )}
      </div>
    </div>
  );
};

export default PanelPedidos;
