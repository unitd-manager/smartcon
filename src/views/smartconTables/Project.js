import React,{useEffect,useState} from 'react';
import * as Icon from 'react-feather';
import 'bootstrap/dist/css/bootstrap.min.css';
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery'; 
import "datatables.net-buttons/js/buttons.colVis"
import "datatables.net-buttons/js/buttons.flash"
import "datatables.net-buttons/js/buttons.html5"
import "datatables.net-buttons/js/buttons.print"
import { Link } from 'react-router-dom';
//import { Button } from 'reactstrap';
import api from '../../constants/api';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CommonTable from '../../components/CommonTable';

const Project = () => {

    const [project,setProject] = useState(null);
    const [loading,setLoading] = useState(null);

    const getProject = () =>{
      api.get('project/getProjects')
        .then((res)=> {
          setProject(res.data.data)
          $('#example').DataTable({
            pagingType: 'full_numbers',
            pageLength: 20,
            processing: true,
            dom: 'Bfrtip',
            buttons: [ {
              extend: 'print',
              text: "Print",
              className:"shadow-none btn btn-primary",
          }],
          });
          setLoading(false)
        }).catch(()=>{
          setLoading(false)
        });
      };
    useEffect(() => {
        getProject()

    }, [])
    

   const columns = [
        {
          name: "id",
          selector: "opportunity_id",
          grow:0,
          wrap: true,
        },
        {
            name: 'Edit',
            selector: "edit",
            cell: () => <Icon.Edit2 />,
            grow:0,
            width:'auto',
            button:true,
            sortable:false,
        },
        {
          name: "Code",
          selector: "project_code",
          sortable: true,
          grow:0,
          wrap: true
        },
        {
          name: "Title",
          selector: "title",
          sortable: true,
          grow:2,
          wrap: true
        },
        {
          name: "company",
          selector: "company_name",
          sortable: true,
          grow:0,
        },
        {
            name: "contact",
            selector: "contact_name",
            sortable: true,
            width:'auto',
            grow:3,
          },
          {
            name: "Category",
            selector: "category",
            sortable: true,
            grow:2,
            width:'auto',
          },
          {
            name: "Status",
            selector: "status",
            sortable: true,
            grow:2,
            wrap: true,
          },
      ]
      
      
  return (
   
<div className="MainDiv">
      <div className=" pt-xs-25">
        <BreadCrumbs/>

        <CommonTable
                loading={loading}
          title="Project List"
          // Button={
          //   <Link to="/ProjectDetails">
          //     <Button color="primary" className="shadow-none">
          //       Add New
          //     </Button>
          //   </Link>
          // }
        >
          <thead>
                  <tr >
                  {columns.map(cell=>{
                    return (<td key={cell.name}>{cell.name}</td>)
                  })}
              </tr>
          </thead>
          <tbody>
            {project && project.map((element,i)=>{
                return (<tr key={element.project_id}>
                <td>{i+1}</td>
                <td>
                      <Link to={`/ProjectEdit/${element.project_id}?tab=1`}>
                        <Icon.Edit2 />
                      </Link>
                    </td>
                <td>{element.project_code}</td>
                <td>{element.title}</td>
                <td>{element.company_name}</td>
                <td>{element.contact_name}</td>
                <td>{element.category}</td>
                <td>{element.status}</td>
                </tr>)
            })}
          </tbody>
</CommonTable> 
      </div>
    </div>)
}

export default Project;