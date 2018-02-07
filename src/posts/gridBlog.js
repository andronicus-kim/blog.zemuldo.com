import React from 'react'
import {Card, Button, Header,Image, Icon} from 'semantic-ui-react'
import {topicsOBJ} from '../conf/conf'
import PropTypes from 'prop-types'
import moment from 'moment'
import {connect} from 'react-redux'
const getTopiINfo = (topics) => {
  let info = []
  topics.forEach(function (topic) {
    info.push(topicsOBJ[topic].name)
  })
  return info
}

class GridBlog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showInfo: false
    }
  }

  render () {
    let o = this.props.blog
    let w = Math.round((o.wordCount/130))
    return (
      <Card 
      onClick={()=>this.props.history.push('/' + o.type + '/' + o.topics[0] + '/' + o.author.userName + '-' + o.title.split(' ').join('-') + '-' + o.date.split(' ').join('-') + '-' + o.id.toString())}
      className='blogCard' style={{
        width: 'auto',
        maxWidth: '300px',
        minWidth: '100px',
        position:"relative"
      }}
            >
        <Card.Content>
          <Card.Header>
            <Header color='green' as='h3'>
              {o.title.split(' ').join(' ')}
            </Header>
          </Card.Header>
          <Card.Meta>
                        <Icon size='small' inverted circular color='blue' name = 'like outline'/>
                        <Icon size='small' inverted circular color='red' name = 'like'/>
                <span>
                {o.likes}
                </span>
          </Card.Meta>
          <Card.Description>
            <p>{o.about}</p>
            <p>
                  <br />
              Related Topics
                  <br />
              {getTopiINfo(o.topics).join(', ')}
              <br />
              {
                o.updated ?
                  <span>
                    Last updated  {moment().to(o.updated)}
                  </span> : <span>
                    Published  {moment().to(o.date)}
                  </span>
              }
              
            </p>
          </Card.Description>
          <div>
            <br/>
            <Image
            size='big'
              avatar
              rounded
              style={{ maxHeight: '130px' }}
              alt={'blogs image'}
              src={this.props.vars.env.httpURL + o.author.url}
            />

            <span className='info'>
              {o.author.name} {' '}
            </span>
            <br/>
            <span>
              {moment(o.date).format('ll')}
            </span>{', '}
            <span className='colorGreen'>
              {w>60?Math.round((w/60))+'Hours,'+w%60+' ':w+' '} Minutes read
              </span>
          </div>
        </Card.Content>
      </Card>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    vars: state.vars,
  }
}

GridBlog.propTypes = {
  blog: PropTypes.object.isRequired,
  color: PropTypes.string.isRequired,
  vars:PropTypes.object.isRequired
}

export default connect(mapStateToProps)(GridBlog)
