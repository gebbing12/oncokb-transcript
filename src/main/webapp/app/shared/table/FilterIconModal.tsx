import React, { useMemo, useState, useRef, useEffect } from 'react';
import { observer } from 'mobx-react';
import { VscFilterFilled } from 'react-icons/vsc';
import { Input } from 'reactstrap';
import { createPortal } from 'react-dom';
import './filter-icon-modal.scss';
import { usePopper } from 'react-popper';
import { Button } from 'reactstrap';

interface IFilterIconModalProps {
  id: string;
  tableRef: React.RefObject<HTMLDivElement>;
  allSelections: Set<string>;
  currSelections: Set<string>;
  updateSelections: (selected: Set<string>) => void;
}

interface FilterMenuProps {
  selections: Set<string>;
  tableRef: React.RefObject<HTMLDivElement>;
  iconRef: React.RefObject<HTMLDivElement>;
  currSelections: Set<string>;
  updateSelections: (selected: Set<string>) => void;
}

const FilterMenu = ({ selections, tableRef, iconRef, currSelections, updateSelections }: FilterMenuProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const [newSelections, setNewSelections] = useState(currSelections);

  const { styles, attributes } = usePopper(iconRef?.current, popperElement, {
    placement: 'bottom-start',
  });

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  const SearchedSelections = useMemo(() => {
    return [...selections].filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [selections, searchTerm]);

  const handleCheckboxChange = (value, event) => {
    event.stopPropagation();
    if (event.target.checked) {
      newSelections.add(value);
    } else {
      newSelections.delete(value);
    }
    setNewSelections(new Set(newSelections));
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    if (event.target.checked) {
      setNewSelections(new Set(selections));
    } else {
      setNewSelections(new Set());
    }
  };

  const applyFilter = () => {
    updateSelections(new Set(newSelections));
  };

  return tableRef.current
    ? createPortal(
        <div
          className="filter-overlay"
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ marginTop: '10px' }}>
            <Input placeholder="Search" value={searchTerm} onChange={handleSearchChange} />
            <div className="checkbox-list">
              <div>
                <Input type="checkbox" onChange={e => handleSelectAll(e)} />
                <label>Select All</label>
              </div>
              {SearchedSelections.map(selection => (
                <div key={selection}>
                  <Input type="checkbox" checked={newSelections.has(selection)} onChange={e => handleCheckboxChange(selection, e)} />
                  <label>{selection}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="d-flex justify-content-end pt-2">
            <Button onClick={applyFilter} color="primary" size="sm">
              Filter
            </Button>
          </div>
        </div>,
        tableRef.current,
      )
    : null;
};

export const FilterIconModal = observer((props: IFilterIconModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const iconRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (menuRef.current && !menuRef.current.contains(event.target) && iconRef.current && !iconRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="filter-component" ref={iconRef} style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
      <VscFilterFilled
        className={`filter-icon ${isOpen ? 'visible' : ''}`}
        color={'grey'}
        size={10}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      />
      {isOpen && (
        <div ref={menuRef}>
          <FilterMenu
            selections={props.allSelections}
            tableRef={props.tableRef}
            iconRef={iconRef}
            currSelections={props.currSelections}
            updateSelections={props.updateSelections}
          />
        </div>
      )}
    </div>
  );
});

export default FilterIconModal;