import Modal from 'react-bootstrap/Modal'

function Terms({company}) { 
  return (
    <>
        <Modal.Header closeButton>
          <Modal.Title>
            <p className="text-center">Terms of Use</p>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>This confirms the agreement between {company === '' ? 'the Requester' : `${company}`} and American Public Television to provide program airdate information. {company === '' ? 'The Requester' : `${company}`} intends to use the data provided by APT for internal research purposes. The parties understand and acknowledge that {company === '' ? 'the Requester' : `${company}`} may, in the normal course of its business, provide certain programming information to Producers, Co-Producers and/or Funders on only those shows owned or produced by the client and distributed through APT and owned or produced by the client.</p> 

          <p>APT shall make every reasonable effort to provide {company === '' ? 'the Requester' : `${company}`} with accurate and timely data; however, APT does not warrant the accuracy of the data or provide any indemnification to {company === '' ? 'the Requester' : `${company}`} for any activity conducted by {company === '' ? 'the Requester' : `${company}`} or any other party in its use of the data. {company === '' ? 'the Requester' : `${company}`} shall not make any claim against APT on the basis of mistakes, errors, or omissions in the data, or for non-delivery or late delivery of data. {company === '' ? 'The Requester' : `${company}`} understands that its exclusive remedy for all claims relating to this agreement shall not exceed the total amount of the fees paid to APT under this agreement.
          </p>
        </Modal.Body>
    </>
  )
}

export default Terms