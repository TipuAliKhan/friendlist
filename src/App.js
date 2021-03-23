import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pagination: {
        currentPage: 1,
        isPagination: false,
      },
      friendList: [],
      displayList: []
    }
  }

  updateDisplayList = () => {
    const friendsToDisplay = this.state.friendList.slice((this.state.pagination.currentPage - 1) * 4, ((this.state.pagination.currentPage - 1) * 4) + 4);
    this.setState({ displayList: friendsToDisplay });
  }

  findOrAddFriend = (e) => {
    if (e.key === 'Enter') {
      const isInList = this.state.friendList.filter((el) => el.name.toLowerCase() === e.target.value.toLowerCase());
      if (isInList.length) {
        alert(`${e.target.value} is already in list. ${isInList[0].name} has id: ${isInList[0].id} ${isInList[0].isFav ? 'and has marked Favourite' : '.'}`);
        return false;
      }

      if (!e.target.value) {
        return false;
      }

      const friendList = [...this.state.friendList];
      friendList.push({
        "name": e.target.value,
        isFav: false,
        id: Math.floor(1000000000 + Math.random() * 999090).toString()
      });
      this.setState({ friendList: friendList },() => {
        this.updateDisplayList();
        if (this.state.friendList.length > 4) {
          this.setState((state, props) => ({pagination: {currentPage: state.pagination.currentPage, isPagination: true} }));
        }
      });
      e.target.value = '';
    }
  }

  addToFav = (id) => {
    const isInList = this.state.friendList.map(e => { if (e.id === id) { e.isFav = true; return e } return e });
    this.setState({ friendList: isInList });
  }

  handleDelete = (id) => {
    const isInList = this.state.friendList.filter(e => e.id !== id);
    this.setState((state, props) => ({ friendList: isInList }), ()=>{
      this.updateDisplayList();

      if (this.state.friendList.length <= 4) {
        this.setState((state, props) => ({pagination: { currentPage: state.pagination.currentPage, isPagination: false }}));
      }
    });
  }

  handleNext = () => {
    if (this.state.friendList.length > 4) {
      this.setState(
        (state, props) => ({
          pagination: { currentPage: state.pagination.currentPage + 1, isPagination: state.pagination.isPagination },
        }),
        () => {
          const currentPage = this.state.pagination.currentPage;
          const friendsToDisplay = this.state.friendList.slice(
            (currentPage - 1) * 4,
            (currentPage - 1) * 4 + 4
          );
          this.setState({ displayList: friendsToDisplay });
        }
      );
    }
  };

  handlePrev = () => {
    if (this.state.friendList.length > 4) {
      this.setState((state, props) => ({
        pagination: { currentPage: state.pagination.currentPage - 1, isPagination: state.pagination.isPagination },
      }), () => {
        const currentPageNumer = this.state.pagination.currentPage;
        const friendsToDisplay = this.state.friendList.slice((currentPageNumer - 1) * 4, ((currentPageNumer - 1) * 4) + 4);
        this.setState({ displayList: friendsToDisplay });
      });
    }
  }

  render() {
    return (
      <div className="App">
        <div className="container">
          <div className="head">
            Friends List
          </div>
          <div className="body">
            <input list="friends" id="add-friend" onKeyDown={this.findOrAddFriend} placeholder="Enter your friend's name" />

            <datalist id="friends">
              {this.state.friendList.map((e, i) => (
                <option value={e.name} key={i} />
              ))}
            </datalist>
            <ul>
              {
                this.state.displayList.map((e, i) => (
                  <li key={i}>
                    <div className="list">
                      <div className="detail">
                        <h2>{e.name}</h2>
                        <p>is your friend</p>
                      </div>
                      <div className="action">
                        <button onClick={() => this.addToFav(e.id)}>{e.isFav ? '★' : '☆'}</button>
                        <button onClick={() => this.handleDelete(e.id)}>⊗</button>
                      </div>
                    </div>
                  </li>
                ))
              }
            </ul>
            {
              this.state.pagination.isPagination ? (
                <div className="pagination">
                  <span style={{visibility: this.state.pagination.currentPage == 1 ?'hidden':'visible'}} onClick={this.handlePrev}>Prev</span>
                  <span style={{visibility: (this.state.pagination.currentPage*4) >= this.state.friendList.length ?'hidden':'visible'}} onClick={this.handleNext}>Next</span>
                </div>) : ''
            }
          </div>

        </div>
      </div>
    )
  }
}

export default App;
