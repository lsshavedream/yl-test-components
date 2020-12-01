import React, {useEffect} from "react";

interface TableTrComponentProps {
  contextMenuEvent: () => void
}

const TableTrComponent:React.FC<TableTrComponentProps> = ({contextMenuEvent, ...rest}) => {
  useEffect(() => {
    document.addEventListener("contextmenu",contextMenuEvent);
    return () => {
      document.removeEventListener("contextmenu",contextMenuEvent)
    }
  },[])
  return (
    <tr {...rest} />
  )
}

export default TableTrComponent
