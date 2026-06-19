import React from 'react';

export const DataTable = ({ headers, children }) => {
  return (
    <table className="custom-table">
      <thead>
        <tr>
          {headers.map((h, i) => <th key={i}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {children}
      </tbody>
    </table>
  );
};
