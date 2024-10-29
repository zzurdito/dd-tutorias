import { Link } from 'react-router-dom';


function VoucherBtn() {

  return (
    <Link to="/content/voucher" className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded">Buy more tokens</Link>
  )
}

export default VoucherBtn