import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import ItemTypes from 'constants/itemTypes';
import Icon from 'components/Icon';
import { cleanString } from 'helpers/stringHelpers';
import { Color } from 'constants/css';

const listItemSource = {
  beginDrag(props) {
    return {
      id: props.item.id
    };
  },
  isDragging(props, monitor) {
    return props.item.id === monitor.getItem().id;
  }
};

const listItemTarget = {
  hover(targetProps, monitor) {
    const targetId = targetProps.item.id;
    const sourceProps = monitor.getItem();
    const sourceId = sourceProps.id;

    if (sourceId !== targetId) {
      targetProps.onMove({ sourceId, targetId });
    }
  }
};

class SortableListItem extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func,
    connectDropTarget: PropTypes.func,
    index: PropTypes.number,
    isDragging: PropTypes.bool,
    item: PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired
    }).isRequired
  };
  render() {
    const {
      connectDragSource,
      connectDropTarget,
      isDragging,
      index,
      item
    } = this.props;
    return connectDragSource(
      connectDropTarget(
        <nav
          style={{
            opacity: isDragging ? 0 : 1,
            borderTop: index === 0 && `1px solid ${Color.borderGray()}`,
            color: Color.darkerGray()
          }}
        >
          <section>{cleanString(item.label)}</section>
          <Icon icon="align-justify" style={{ color: Color.menuGray() }} />
        </nav>
      )
    );
  }
}

export default DragSource(
  ItemTypes.LIST_ITEM,
  listItemSource,
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
)(
  DropTarget(ItemTypes.LIST_ITEM, listItemTarget, connect => ({
    connectDropTarget: connect.dropTarget()
  }))(SortableListItem)
);
