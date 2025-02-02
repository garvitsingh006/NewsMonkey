import React, { useEffect, useState } from 'react'
import Newsitem from './Newsitem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component"

const News = (props) => {

    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)

    const updateNews = async () => {
        let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`
        setLoading(true)
        props.setProgress(10)
        let data  = await fetch(url)
        props.setProgress(30)
        let parsedData = await data.json()
        props.setProgress(50)
        console.log(parsedData)
        if (Array.isArray(parsedData.articles)) {
            setArticles(parsedData.articles)
            setTotalResults(parsedData.totalResults)
            setLoading(false)
            props.setProgress(100)

        } else {
            setArticles([])
            setTotalResults(0)
            setLoading(false)
            props.setProgress(100)
        }
    }

    useEffect(() => {
        updateNews()
        //eslint-disable-next-line
    }, [])

    const fetchMoreData = async () => {
        const nextPage = page + 1
        setPage(nextPage)
        setLoading(true)
        let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${nextPage}&pageSize=${props.pageSize}`
        let data  = await fetch(url)
        let parsedData = await data.json()
        console.log(parsedData)
        if (Array.isArray(parsedData.articles)) {
            setArticles(articles.concat(parsedData.articles))
            setTotalResults(parsedData.totalResults)
            setLoading(false)
            props.setProgress(100)

        } else {
            setArticles([])
            setTotalResults(0)
            setLoading(false)
            props.setProgress(100)
        }
    }

    const capitalizeFirstLetter = (val) => {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

        return (
            <>
                <h1 className="text-center" style={{margin: '30px 0px', marginTop: '90px'}}>NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
                {loading && articles.length === 0 && <Spinner />}
                <InfiniteScroll
                    dataLength={articles.length}
                    next={fetchMoreData}
                    hasMore={articles.length <= totalResults}
                    loader={loading  && articles.length > 0 && <Spinner />}
                >
                    <div className="container">
                        <div className="row">
                            {articles.map((element, index) => {
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


News.defaultProps = {
    country: "us",
    pageSize: 12,
    category: "general"
}

News.propTypes = {
    country: PropTypes.string.isRequired,
    pageSize: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
}

export default News
