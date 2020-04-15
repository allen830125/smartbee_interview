/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import searchIcon from './search.svg'
import './App.css'

const API_KEY = 'AIzaSyCYMjticrN8B3-EMXKlP5HPyiaPOeqLgaY'
const API_PATH = 'https://www.googleapis.com/youtube/v3/search'
const MAX_ROWS = 10

const App = () => {
  const [query, setQuery] = useState('')
  const [list, setList] = useState([])
  const [pageList, setPageList] = useState([])
  const [pageIdx, setIdx] = useState(0)

  const onSearch = async () => {
    const params = {
      key: API_KEY,
      part: 'snippet',
      maxResults: 50,
      q: query,
    }
    try {
      const doApi = await axios.get(API_PATH, { params }) || {}
      const { data = {} } = doApi
      const { items = [] } = data
      setList(items)
      setIdx(0)
      const plist = []
      for (let i = 1; i <= items.length / MAX_ROWS; i++) {
        plist.push(i)
      }
      setPageList(plist)
    } catch (err) {
      console.error(err)
    }
  }

  const getDetail = (id) => {
    const url = `https://www.youtube.com/watch?v=${id}`
    window.open(url, '_blank')
  }

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
            style={{ marginLeft: '5px' }}
            role="presentation"
            alt="search"
            height="18"
            src={searchIcon}
            onClick={() => onSearch()} />
        </div>
      </div>
      <div className="list-area">
        {list.slice(MAX_ROWS * pageIdx, MAX_ROWS * pageIdx + MAX_ROWS).map((item = {}) => {
          const { id = {}, snippet = {} } = item
          const { videoId = '' } = id
          const { title = '', thumbnails = {} } = snippet
          const { medium: img = {} } = thumbnails
          const { url: background, width, height } = img
          return (
            <div
              role="button"
              tabIndex="0"
              className="detail"
              style={{ width, height }}
              onClick={() => getDetail(videoId)}>
              <img src={background} alt="" />
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
        {pageList.map(page => (
          <span
            role="presentation"
            onClick={() => setIdx(page - 1)}
            className={pageIdx + 1 === page ? 'selected' : ''}>
            {page}
          </span>
        ))}
      </div>
    </div>
  )
}

export default App
