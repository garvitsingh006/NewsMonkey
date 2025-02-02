import React, { Component } from 'react'
import Newsitem from './Newsitem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component"

export class News extends Component {

    static defaultProps = {
        country: "us",
        pageSize: 12,
        category: "general"
    }

    static propTypes = {
        country: PropTypes.string.isRequired,
        pageSize: PropTypes.number.isRequired,
        category: PropTypes.string.isRequired,
    }

    constructor() {
        super()
        this.state = {
            articles: [],
            loading: false,
            page: 1,
            totalResults: 0
        }
    }

    async updateNews() {
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`
        this.setState({loading: true})
        this.props.setProgress(10)
        let data  = await fetch(url)
        this.props.setProgress(30)
        let parsedData = await data.json()
        this.props.setProgress(50)
        console.log(parsedData)
        if (Array.isArray(parsedData.articles)) {
            this.setState({
                articles: parsedData.articles,
                loading: false,
                totalResults: parsedData.totalResults
            });
            this.props.setProgress(100)

        } else {
            this.setState({ articles: [], loading: false, totalResults: 0 }); // Fallback if articles is undefined
            this.props.setProgress(100)
        }
    }

    async componentDidMount() {
        this.updateNews()
    }

    // handlePrevClick = () => {
    //     this.setState(prevState => {
    //         return { page: prevState.page - 1 };
    //     }, () => {
    //         this.updateNews();
    //     });
    // }
    // handleNextClick = () => {
    //     this.setState(prevState => {
    //         return { page: prevState.page + 1 };
    //     }, () => {
    //         this.updateNews();
    //     });
    // }

    fetchMoreData = async () => {
        const nextPage = this.state.page + 1
        this.setState({page: nextPage})
        this.setState({loading: true})
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${nextPage}&pageSize=${this.props.pageSize}`
        let data  = await fetch(url)
        let parsedData = await data.json()
        console.log(parsedData)
        if (Array.isArray(parsedData.articles)) {
            this.setState({
                articles: this.state.articles.concat(parsedData.articles),
                totalResults: parsedData.totalResults,
                loading: false
            });
        } else {
            this.setState({ articles: [], totalResults: 0, loading: false});
        }
    }

    capitalizeFirstLetter(val) {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    render() {
        return (
            <>
                <h1 className="text-center" style={{margin: '30px 0px'}}>NewsMonkey - Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h1>
                {this.state.loading && this.state.articles.length === 0 && <Spinner />}
                <InfiniteScroll
                    dataLength={this.state.articles.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.articles.length <= this.state.totalResults}
                    loader={this.state.loading  && this.state.articles.length > 0 && <Spinner />}
                >
                    <div className="container">
                        <div className="row">
                            {this.state.articles.map((element, index) => {
                                return <div className="col-md-4" key={`${element.url}-${element.title}-${index}`}>
                                    <Newsitem title={element.title ? element.title.slice(0, 45) : ""} description={element.description ? element.description.slice(0, 88) : ""} imageUrl={element.urlToImage ? element.urlToImage : "https://static.files.bbci.co.uk/ws/simorgh-assets/public/sport/images/metadata/poster-1024x576.png"} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                                </div>
                            })}
                        </div>
                    </div>
                </InfiniteScroll>
            </>
        )
    }
}

export default News
