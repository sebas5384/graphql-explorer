import React, { Fragment, useRef } from 'react'
import Card from '../components/Card'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { sort, ascend, prop } from 'ramda'
import copy from 'copy-to-clipboard';

const Code = styled(Card)`
  padding: 1em 1em 20em;
  cursor: text;
`

const FieldNode = styled.span`
  line-height: 1.8em;
  margin: 0;
  font-size: 1em;
  font-family: Fira Code, "Consolas", "Inconsolata", "Droid Sans Mono", "Monaco", monospace;
  color: #ddd;
  font-weight: 100;
`

const FieldName = styled.span`
  color: #ec63c5;
  font-weight: 500;
`

const TypeName = styled.span`
  font-style: italic;
`

const CopyLabel = styled.p`
  color: white;
  padding: 1em;
  font-size: 12px;
  background-color: rgba(38,25,58,0.97);
`

const CodeContainer = () => {
  const { nodes } = useSelector(mapStateToProps)
  const codeRef = useRef()

  const copyToClipboard = () => copy(codeRef.current.textContent)

  return (
    <Fragment>
      <CopyLabel>Click in the code to copy to clipboard</CopyLabel>

      <Code ref={codeRef} onClick={copyToClipboard}>
        { nodes.map((node, key) => (
          <Fragment key={node.name + key}>
            <FieldNode>
              <TypeName>{'type '}</TypeName>
              <FieldName>{node.name}</FieldName>
              {' {'}
            </FieldNode>
            { node.fields.map(({ name, type }, key) => (
              <FieldNode key={node.name + key}>&nbsp;&nbsp;{ name + ':'}&nbsp;<FieldName>{type}</FieldName></FieldNode>
            ))}
            <FieldNode>{'}'}</FieldNode>
            <br />
          </Fragment>
        ))}
      </Code>
    </Fragment>
  )
}

const mapStateToProps = ({ nodes }) => {
  const modelNodes = nodes.filter(({ type }) => type === 'model')
  const sortedNodes = sort(ascend(prop('name')), modelNodes)
  return { nodes: sortedNodes };
}

export default CodeContainer