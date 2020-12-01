import {useEffect} from "react"

export function useOnClickOutside(ref: any, handler: (event: any) => void) {
  useEffect(
    () => {
      const listener = (event: any) => {
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }

        handler(event);
      };

      document.addEventListener('click', listener, true);

      return () => {
        document.removeEventListener('click', listener, true);
      };
    },
    [ref, handler]
  );
}

export function useRightClick(ref: any, handler: (event: any) => void) {
  useEffect(
    () => {
      const listener = (event: any) => {
        if (ref.current && ref.current.contains(event.target)) {
          event.preventDefault();
          handler(event);
        }
      };
      document.addEventListener('contextmenu', listener, true);
      return () => {
        document.removeEventListener('contextmenu', listener, true);
      };
    },
    [ref, handler]
  );
}

export const flatten = (treeData: any, childName: string = "children", parentId: string = "", parentIdName: string = "uid") => {
  if(treeData && treeData.length) {
    return treeData.reduce((arr: object[], item: object) => {
      return arr.concat([{...item,parentId}], flatten(item[childName],childName,item[parentIdName],parentIdName))
    },[])
  }
  return []
}

// export const toTreeData = (list: object[]) => {
//   if(!list || !list.length) return []
//   const data = JSON.parse(JSON.stringify(list));
//
// }

export const toTreeData = (data: object[], options = {}) => {

  const list = JSON.parse(JSON.stringify(data));

  const {
    keyField = 'uid',
    childField = 'children',
    parentField = 'parentId'
  } = options

  const tree = []
  const record = {}

  for (let i = 0, len = list.length; i < len; i += 1) {
    const item = list[i]
    const id = item[keyField]

    if (!id) {
      continue
    }

    if (record[id]) {
      item[childField] = record[id]
    } else {
      item[childField] = record[id] = []
    }

    if (item[parentField]) {
      const parentId = item[parentField]

      if (!record[parentId]) {
        record[parentId] = []
      }

      record[parentId].push(item)
    } else {
      tree.push(item)
    }
  }

  return tree
}




