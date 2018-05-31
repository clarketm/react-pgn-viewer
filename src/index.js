import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import CompleteBoard from './CompleteBoard'

class PgnViewer extends React.Component {
  constructor(props) {
    super(props)

    this.createInnerHtml = this.createInnerHtml.bind(this)
    this.setPgn = this.setPgn.bind(this)
    this.additionalHTMLModification = this.additionalHTMLModification.bind(this)

    //save fens in state? in case of updating
    this.state = { pgns: null }
  }

  createInnerHtml() {
    return {__html: this.props.children};
  }

  additionalHTMLModification() {
    //add support for multiple nodes/functions?
    const { nodeToModify, nodeModification } = this.props
    const nodes = ReactDOM.findDOMNode(this).querySelectorAll(nodeToModify)

    if(typeof nodeModification !== 'function' || !nodeToModify) return null

    for (let i = 0; i < nodes.length; i++) { //eslint-disable-line
        nodeModification(nodes[i])
    }
  }

  setPgn(pgns) {
    const { children, blackSquareColour, fen, isDraggable, orientation, width, backgroundColor } = this.props
    const nodes = ReactDOM.findDOMNode(this).querySelectorAll('pgn')

    // define a const or funciton or something para no usar esta dos veces
    for(let i=0; i<nodes.length; i++) {
      ReactDOM.render(<CompleteBoard
        pgnInformation={pgns[i]}
        blackSquareColour={blackSquareColour}
        fen={fen}
        isDraggable={isDraggable}
        orientation={orientation}
        width={width}
        backgroundColor={backgroundColor}
      />, nodes[i])
    }
  }

  componentDidMount() {
    const nodes = ReactDOM.findDOMNode(this).querySelectorAll('pgn')
    let pgns = []

    for(let i=0; i < nodes.length; i++) {
      pgns.push(nodes[i].innerHTML.slice(0))
    }

    this.setState({ pgns: pgns })

    this.additionalHTMLModification()
    this.setPgn(pgns)
  }

  componentDidUpdate() {
    // extra components in react dev tools?!
    this.additionalHTMLModification()
    this.setPgn(this.state.pgns)
  }

  render() {
    const {
      blackSquareColour,
      fen,
      isDraggable,
      orientation,
      children,
      innerHTML,
      width,
      backgroundColor,
    } = this.props

    const pgnStyles = {
      display: 'flex',
      justifyContent: 'center'
    }

    return (
      <div style={pgnStyles}>
        {innerHTML && <div dangerouslySetInnerHTML={this.createInnerHtml()}></div>}
        {!innerHTML &&
          <div>
            <CompleteBoard
              children={children}
              blackSquareColour={blackSquareColour}
              fen={fen}
              width={width}
              isDraggable={isDraggable}
              orientation={orientation}
              backgroundColor={backgroundColor}
            />
          </div>
        }
      </div>
    )
  }
}

PgnViewer.propTypes = {
  backgroundColor: PropTypes.string,
  blackSquareColour: PropTypes.string,
  fen:PropTypes.string,
  isDraggable: PropTypes.bool,
  nodeToModify: PropTypes.string,
  nodeModification: PropTypes.func,
  orientation: PropTypes.string,
  width: PropTypes.number,
}

PgnViewer.defaultProps = {
  width: 600,
  backgroundColor: '#e1e5ed',
}

export default PgnViewer
