import React, { Component } from 'react';
import styled from 'styled-components';
import { Pagination } from '../../core/models/Pagination.model';

const PageItem = styled.li<any>`
    & button {
        cursor: pointer;
        position: relative;
        display: inline-block;
        padding: 0.5rem 0.75rem;
        line-height: 1.25;
        color: ${(props) => (props.isActive ? '#fff' : '#5CB85C')};
        background-color: ${(props) => (props.isActive ? '#5CB85C' : '#fff')};
        border: ${(props) => (props.isActive ? ' 1px solid #5CB85C' : '1px solid #dee2e6')};
        &:focus {
            outline: 0;
        }
    }
`;
const PaginationLayout = styled.ul`
    display: inline-block;
    list-style-type: none;
    box-sizing: border-box;
`;
interface PaginationProps {
    page: Pagination;
    pageNumbers: number[];
    onPageChange(currentPage: number): void;
}
interface PaginationState { }

export default class PaginationComponent extends Component<PaginationProps, PaginationState> {

    handleClick = (index: number) => {
        this.props.onPageChange(index);
    };

    render() {
        const { page, pageNumbers } = this.props;
        return (
            <nav>
<PaginationLayout  className="pagination">
                {pageNumbers.map((p) => (
                    <PageItem isActive={p === page.currentPage} key={p} className="page-item">
                        <button onClick={() => this.handleClick(p)}>{p}</button>
                    </PageItem>
                ))}
            </PaginationLayout>
            </nav>
            
        );
    }
}
