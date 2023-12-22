import { useEffect, useState } from "react";
import axios from 'axios'

function App(){
    const[confs, setConfs] = useState([])
    useEffect(() => {
        axios.get('http://localhost:5000') 
        .then(confs => setConfs(confs.data))
        .catch(err => console.log(err))
    }, [])

    return (
        <div className='w-100 100-vn'>
            <table className='table'>
                <thread>
                    <tr>
                        <th>Title</th>
                        <th>Short name</th>
                        <th>category</th>
                        <th>Location</th>
                    </tr>
                </thread>
                <tbody>
                    {
                        confs.map(conf => {
                            return (
                            // eslint-disable-next-line react/jsx-key
                            <tr>
                                <td>{conf.Title}</td>
                                <td>{conf.ShortName}</td>
                                <td>{conf.Category}</td>
                                <td>{conf.Location}</td>
                            </tr>)
                        })
                    }
                </tbody>
            </table>
        </div>
    );
}

export default App;