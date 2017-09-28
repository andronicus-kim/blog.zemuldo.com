import React,{Component} from 'react'
import { Header, Icon,  List , Grid ,Loader,Input} from 'semantic-ui-react'
import axios from 'axios';
import About from '../partials/aboutHome'
import Blogs from '../partials/blogs'
import Blog from '../partials/blog'
import Topics from '../partials/topics'
import config from '../environments/conf'
const env = config[process.env.NODE_ENV] || 'development'
class DevArticles extends Component {
    constructor(props){
        super(props);
        this.state = {
            blogs:[],
            blog:null,
            logged:false,
            isLoaded: false,
            blogIsLoading:false,
            bodySize:(window.innerWidth<503)?16:12,
            counts:{
                fbC:null,
                twtC:null,
                gplsC:null
            }
        };
        this.goToHome = this.goToHome.bind(this);
        this.onReadMore = this.onReadMore.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.isLoading = this.isLoading.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this._handleChangeBodySize = this._handleChangeBodySize.bind(this);
        this.tick = this.tick.bind(this);
        this.getCounts = this.getCounts.bind(this);
        this.setTopicPosts = this.setTopicPosts.bind(this);
        this.blogsAreLoading = this.blogsAreLoading.bind(this);
    };
    tick () {
        return axios.post(env.httpURL, {
            "query":"getPosts",
            "queryParam":{
                "type":this.props.current
            }
        })
            .then(response => {
                if(response[0].data[0]){
                    this.setState({blogs:response[0].data})
                }
            })
            .catch(exception => {

            });
    }
    onReadMore(thisBlog){
        this.setState({blogIsLoading:true})
        return axios.post(env.httpURL, {
            "query":"getPost",
            "queryParam":{
                "title":thisBlog.title,
                "type":this.props.current
            }
        })
            .then(response => {
                this.setState({blog:response.data})
                this.isLoading(true)
                this.setState({blogIsLoading:false})
                window.scrollTo(0,0)
                let gplusPost = {
                    "method": "pos.plusones.get",
                    "id": "p",
                    "params": {
                        "nolog": true,
                        "id": "https://zemuldo/"+this.state.blog.title.split(' ').join('-'),
                        "source": "widget",
                        "userId": "@viewer",
                        "groupId": "@self"
                    },
                    "jsonrpc": "2.0",
                    "key": "p",
                    "apiVersion": "v1"
                }
                return Promise.all([
                    axios.get('https://graph.facebook.com/?id=http://zemuldo.com/'+this.state.blog.title.split(' ').join('%2520'),{}),
                    axios.get('http://public.newsharecounts.com/count.json?url=http://zemuldo.com/'+this.state.blog.title.split(' ').join('-'),{}),
                    axios.post(' https://clients6.google.com/rpc',gplusPost)
                ])
            })
            .then(function (res) {
                this.setState({counts:{
                    fbC:(res[0].data.share.share_count)? res[0].data.share.share_count:0,
                    twtC:(res[1].data.count)?res[1].data.count:0,
                    gplsC:(res[2].data.result.metadata.globalCounts.count)?res[2].data.result.metadata.globalCounts.count:0
                }})
            }.bind(this))
            .catch(exception => {
                this.isLoading(true)
                return exception
            });
    }
    goToHome(){
        this.setState({current:'ZemuldO-Home'})
    }
    _handleChangeBodySize(size){
        this.setState({bodySize:size})
    }
    getCounts(){
        if(this.state.blog){
            let gplusPost = {
                "method": "pos.plusones.get",
                "id": "p",
                "params": {
                    "nolog": true,
                    "id": "https://zemuldo/"+this.state.blog.title.split(' ').join('-'),
                    "source": "widget",
                    "userId": "@viewer",
                    "groupId": "@self"
                },
                "jsonrpc": "2.0",
                "key": "p",
                "apiVersion": "v1"
            }
            return Promise.all([
                axios.get('https://graph.facebook.com/?id=http://zemuldo.com/'+this.state.blog.title.split(' ').join('%2520'),{}),
                axios.get('http://public.newsharecounts.com/count.json?url=http://zemuldo.com/'+this.state.blog.title.split(' ').join('-'),{}),
                axios.post(' https://clients6.google.com/rpc',gplusPost)
            ])
                .then(function (res) {
                    this.setState({counts:{
                        fbC:(res[0].data.share.share_count)? res[0].data.share.share_count:0,
                        twtC:(res[1].data.count)?res[1].data.count:0,
                        gplsC:(res[2].data.result.metadata.globalCounts.count)?res[2].data.result.metadata.globalCounts.count:0
                    }})
                }.bind(this))
                .catch(exception => {
                    this.isLoading(true)
                    return exception
                });
        }

    }
    resize = () => this.forceUpdate()
    componentDidMount() {
        this.countsInteval = setTimeout(this.getCounts, 400);
        this.forceUpdate()
        if(window.innerWidth<503){
            this._handleChangeBodySize(16)
        }
        if(window.innerWidth>503){
            this._handleChangeBodySize(16)
        }

        window.addEventListener('resize', this.resize)
        return axios.post(env.httpURL, {
            "query":"getPosts",
            "queryParam":{
                "type":this.props.current
            }
        })
            .then(response => {
                if(response.data[0]){
                    this.setState({blogs:response.data})
                    this.isLoading(true)
                }
                else {
                    this.setState({blogs:[]})
                    this.isLoading(true)
                }
                this.getCounts()
            })
            .catch(exception => {

            });
    }
    componentWillUnmount() {
        clearInterval(this.countsInteval);
        window.removeEventListener('resize', this.resize)
    }
    isLoading(value){
        this.setState({ isLoaded: value });
    };

    handleFilterChange(e) {
        e.preventDefault();
        if(e.target.value===''){
            return axios.post(env.httpURL, {
                "query":"getPosts",
                "queryParam":{
                    "type":this.props.current
                }
            })
                .then(response => {
                    this.setState({blogs:response.data})
                })
                .catch(exception => {
                });
        }
        else {
            return axios.post(env.httpURL, {
                "query":"getFiltered",
                "queryParam":{
                    "filter":e.target.value,
                    "type":this.props.current
                }
            })
                .then(response => {
                    this.setState({blogs:response.data})
                })
                .catch(exception => {
                    this.setState({blogs:[]})
                });
        }
    }
    setTopicPosts(topicBlogs,topic){
        if(topicBlogs[0]){
            this.setState({blogs:topicBlogs,topic:topic})
            this.blogsAreLoading(true)
        }
        else {
            this.setState({blogs:[],topic:topic})
            this.blogsAreLoading(true)
        }
    }
    blogsAreLoading(state){
        this.setState({blogsLoading:!state})
    }
    render(){
        return(
            <div>
                {
                    (this.state.isLoaded) ?
                        <div>
                            {
                                (window.innerWidth>503) ?
                                    <Grid columns={2}>
                                        <Grid.Row>
                                            {
                                                (window.innerWidth>600) ?
                                                    <Grid.Column  width={4}>
                                                        <Topics blogsAreLoading={this.blogsAreLoading} setTopicPosts={this.setTopicPosts} onReadMore = {this.onReadMore} blog ={this.state.blog} color={this.props.color} blogs={this.state.blogs}/>
                                                        <div style={{ float: 'left', margin: '2em 3em 3em 2em'}}>
                                                            <Header style={{marginLeft:'10px'}} color='blue' as='h3'>Search for it</Header>
                                                            <Input
                                                                icon={<Icon name='search' inverted circular link />}
                                                                placeholder='Search...'
                                                                onChange={this.handleFilterChange}
                                                            />
                                                            <Header  color={this.props.colors[2]} as='h2'>Most Popular</Header>
                                                            {
                                                                this.state.blogsLoading?
                                                                    <div style={{ position:'center', margin: '4em 0em 0em 0em'}} >
                                                                        <Loader active inline='centered' />
                                                                    </div>:
                                                                    <div>
                                                                        {
                                                                            (this.state.blogs[0]) ?
                                                                                <Blogs color={this.props.color} onReadMore = {this.onReadMore} blogs ={this.state.blogs} blog ={this.state.blog}/>:
                                                                                <div>
                                                                                    No matching content on this Topic
                                                                                </div>
                                                                        }
                                                                    </div>
                                                            }
                                                        </div>
                                                    </Grid.Column>:
                                                    <p>Hello</p>

                                            }
                                            <Grid.Column  width={9}>
                                                {
                                                    (this.state.blogIsLoading) ?
                                                        <div style={{ position:'center', margin: '16em 2em 2em 2em'}}>
                                                            <Loader active inline='centered' />
                                                        </div>:
                                                        <div style={{margin: '3em 3em 3em 1em'}}>
                                                            {
                                                                (this.state.blog===null) ?
                                                                    <About/>:
                                                                    <Blog counts={this.state.counts} color={this.props.color} blog = {this.state.blog}/>
                                                            }
                                                        </div>
                                                }
                                            </Grid.Column>
                                            {
                                                (window.innerWidth>1030) ?
                                                    <Grid.Column  width={2}>


                                                    </Grid.Column>:
                                                    <p>Hello</p>
                                            }
                                        </Grid.Row>
                                    </Grid>:
                                    <Grid columns={2} divided>
                                        <Grid.Row>
                                            {
                                                (window.innerWidth>600) ?
                                                    <Grid.Column  width={4}>
                                                        <Topics blogsAreLoading={this.blogsAreLoading} setTopicPosts={this.setTopicPosts} onReadMore = {this.onReadMore} blog ={this.state.blog} color={this.props.color} blogs={this.state.blogs}/>
                                                        <div style={{ float: 'left', margin: '2em 3em 3em 2em'}}>
                                                            <Header style={{marginLeft:'10px'}} color='blue' as='h3'>Search for it</Header>
                                                            <Input
                                                                icon={<Icon name='search' inverted circular link />}
                                                                placeholder='Search...'
                                                                onChange={this.handleFilterChange}
                                                            />
                                                            <Header  color={this.props.colors[2]} as='h2'>Most Popular</Header>
                                                            {
                                                                this.state.blogsLoading?
                                                                    <div style={{ position:'center', margin: '4em 0em 0em 0em'}} >
                                                                        <Loader active inline='centered' />
                                                                    </div>:
                                                                    <div>
                                                                        {
                                                                            (this.state.blogs[0]) ?
                                                                                <Blogs color={this.props.color} onReadMore = {this.onReadMore} blogs ={this.state.blogs} blog ={this.state.blog}/>:
                                                                                <div>
                                                                                    No matching content on this Topic
                                                                                </div>
                                                                        }
                                                                    </div>
                                                            }
                                                        </div>
                                                    </Grid.Column>:
                                                    <p>Hello</p>

                                            }
                                            <Grid.Column  width={16}>
                                                {
                                                    (this.state.blogIsLoading) ?
                                                        <div style={{ position:'center', margin: '16em 2em 2em 2em'}}>
                                                            <Loader active inline='centered' />
                                                        </div>:
                                                        <div style={{margin: '3em 1em 3em 2em'}}>
                                                            {
                                                                (this.state.blog===null) ?
                                                                    <About/>:
                                                                    <Blog counts={this.state.counts} color={this.props.color} blog = {this.state.blog}/>
                                                            }
                                                        </div>
                                                }
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                            }

                        </div>:
                        <div   style={ {height:window.innerHeight,margin: '20em 3em 1em 0em'}}>
                            <Loader active inline='centered' />
                        </div>
                }
            </div>)
    }
}
export default DevArticles