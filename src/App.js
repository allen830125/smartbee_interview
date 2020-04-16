/* eslint-disable no-undef */
import React, { useState } from 'react'
import axios from 'axios'
import searchIcon from './search.svg'
import './App.css'

const API_KEY = 'AIzaSyCYMjticrN8B3-EMXKlP5HPyiaPOeqLgaY'
const API_PATH = 'https://www.googleapis.com/youtube/v3/search'
const MAX_ROWS = 50
const PAGE_ROWS = 10

const App = () => {
  const [query, setQuery] = useState('')
  const [list, setList] = useState([])
  const [pageToken, setToken] = useState({})
  const [pageList, setPageList] = useState([])
  const [pageIdx, setIdx] = useState(0)
  const params = {
    key: API_KEY,
    part: 'snippet',
    type: 'video',
    maxResults: MAX_ROWS,
    q: query,
  }

  const onSearch = async () => {
    try {
      const doApi = await axios.get(API_PATH, { params }) || {}
      const { data = {} } = doApi
      const { items = [], nextPageToken } = data
      setList(items)
      setIdx(0)
      const plist = []
      for (let i = 1; i <= items.length / PAGE_ROWS; i++) {
        plist.push(i)
      }
      setToken({ nowPage: 1, token: [nextPageToken] })
      setPageList(plist)
    } catch (err) {
      console.error(err)
    }
  }
  const getDetail = (id) => {
    const url = `https://www.youtube.com/watch?v=${id}`
    window.open(url, '_blank')
  }
  const goPrev = () => {
    if (pageIdx === 0) {
      return
    }
    if (pageIdx > pageList[0] - 1) {
      setIdx(pageIdx - 1)
      return
    }
    const { nowPage = -1 } = pageToken
    if (nowPage > 0) {
      const newPage = nowPage - 1
      const pageNum = (newPage - 1) * MAX_ROWS / PAGE_ROWS
      const plist = []
      for (let i = pageNum + 1; i <= MAX_ROWS * (newPage) / PAGE_ROWS; i++) {
        plist.push(i)
      }
      setPageList(plist)
      setToken({ ...pageToken, nowPage: nowPage - 1 })
      setIdx(plist[plist.length - 1] - 1)
    }
  }
  const goNext = async () => {
    try {
      if (pageIdx < pageList[pageList.length - 1] - 1) {
        setIdx(pageIdx + 1)
        return
      }
      const { nowPage = -1, token = [] } = pageToken
      const nowToken = token[nowPage - 1] || ''
      const newPageToken = { nowPage: nowPage + 1, token: [...token] }
      if (list.length <= nowPage * MAX_ROWS) {
        const param = nowToken === '' ? params : { ...params, pageToken: nowToken }
        const doApi = await axios.get(API_PATH, { params: param }) || {}
        const { data = {} } = doApi
        const { items = [], nextPageToken } = data
        setList([...list, ...items])
        newPageToken.token = [...token, nextPageToken]
      }
      const pageNum = nowPage * MAX_ROWS / PAGE_ROWS
      setIdx(pageNum)
      const plist = []
      for (let i = pageNum + 1; i <= MAX_ROWS * (nowPage + 1) / PAGE_ROWS; i++) {
        plist.push(i)
      }
      setToken(newPageToken)
      setPageList(plist)
    } catch (err) {
      console.error(err)
    }
  }

  const fromNum = PAGE_ROWS * pageIdx
  const endNum = fromNum + PAGE_ROWS

  return (
    <div>
      <div className="search-area">
        <div style={{ borderBottom: '1px solid #fff', paddingBottom: '2px' }}>
          <input
            type="text"
            style={{
              border: '0 none',
              outline: 'none',
              backgroundColor: 'rgb(228, 89, 87)',
              color: '#ffffff',
              fontSize: '18px'
            }}
            value={query}
            onChange={(e) => setQuery(e.target.value)} />
          <img
            style={{ marginLeft: '5px', cursor: 'pointer' }}
            role="presentation"
            alt="search"
            height="18"
            src={searchIcon}
            onClick={() => onSearch()} />
        </div>
      </div>
      <div className="list-area">
        {list.slice(fromNum, endNum).map((item = {}) => {
          const { id = {}, snippet = {} } = item
          const { videoId = '' } = id
          const { title = '', thumbnails = {} } = snippet
          const { medium: img = {} } = thumbnails
          const { url: background } = img
          return (
            <div
              role="button"
              tabIndex="0"
              className="detail"
              key={`${fromNum}_${videoId}`}
              style={{ width: '320px', height: '180px' }}
              onClick={() => getDetail(videoId)}>
              <img src={background} alt="" width="320" height="180" />
              <div style={{ width: '95%' }}>
                <div className="ellipsis">
                  {title}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="page-area">
        {pageList.length > 0 ? (
          <span
            role="presentation"
            onClick={() => goPrev()}>prev
          </span>
        ) : null}
        {pageList.map(page => (
          <span
            role="presentation"
            key={page}
            onClick={() => setIdx(page - 1)}
            className={pageIdx + 1 === page ? 'selected' : ''}>
            {page}
          </span>
        ))}
        {pageList.length > 0 ? (
          <span
            role="presentation"
            onClick={() => goNext()}>
            next
          </span>
        ) : null}
      </div>
    </div>
  )
}

export default App
