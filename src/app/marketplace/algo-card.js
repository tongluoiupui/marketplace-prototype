import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Modal from '../ui/modal';
import ImageRecognition from './image-recognition';
import TextAnalyzer from './text-analyzer';
import { getPurchasedState } from '../../ducks/algorithmns';

class AlgoCard extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    stars: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    downloads: PropTypes.number.isRequired,
    isPurchased: PropTypes.bool.isRequired,
    getPurchasedState: PropTypes.func.isRequired,
  };

  state = {
    isShowingModal: false,
  };

  componentWillMount() {
    const { getPurchasedState, id } = this.props;
    getPurchasedState(id);
  }

  closeModal = e => {
    e.stopPropagation();
    this.setState({ isShowingModal: false });
  }

  renderModal() {
    if (!this.state.isShowingModal) {
      return null;
    }

    const {
      id,
      title,
      thumbnail,
      stars,
      description,
      downloads,
      type,
      model,
      isPurchased,
    } = this.props;

    switch (type) {
      case 'image_recognition':
        return (
          <Modal onClose={this.closeModal}>
            <ImageRecognition
              id={id}
              onClose={this.closeModal}
              title={title}
              thumbnail={thumbnail}
              stars={stars}
              description={description}
              downloads={downloads}
              model={model}
              isPurchased={isPurchased}
            />
          </Modal>
        );
      case 'text':
        return (
          <Modal onClose={this.closeModal}>
            <TextAnalyzer
              id={id}
              onClose={this.closeModal}
              title={title}
              thumbnail={thumbnail}
              stars={stars}
              description={description}
              downloads={downloads}
              model={model}
              isPurchased={isPurchased}
            />
          </Modal>
        );
      default:
        return (
          <Modal onClose={this.closeModal}>
            <div>Coming soon!</div>
          </Modal>
        );
        
    }
  }

  render() {
    const { title, thumbnail, stars, downloads } = this.props;

    return (
      <div
        className="marketplace__algo-card"
        onClick={() => this.setState({ isShowingModal: true })}
      >
        <div
          className="marketplace__algo-card__hero-image"
          style={{ backgroundImage: `url(${thumbnail})` }}
        />
        <div className="marketplace__algo-card__content">
          <div className="marketplace__algo-card__title">{title}</div>
          <div className="marketplace__algo-card__stars">{`${stars} (${downloads})`}</div>
        </div>
        { this.renderModal() }
      </div>
    );
  }
}

export default connect(
  ({ algorithmns }, { id }) => ({
    isPurchased: Boolean(algorithmns.purchased[id]),
  }),
  dispatch => ({
    getPurchasedState: id => dispatch(getPurchasedState(id)),
  }),
)(AlgoCard);
