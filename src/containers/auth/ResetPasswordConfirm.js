import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import Layout from "../../hocs/layout";
import { connect } from 'react-redux'
import { Oval } from "react-loader-spinner"
import { reset_password_confirm } from "../../redux/actions/auth";


const PasswordConfirm = ({ loading,reset_password_confirm}) => {
  const params = useParams();

  const [requestSent, setRequestSent] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [formData, setFormData] = useState({
    new_password: '',
    re_new_password: '',
  })

  const {
    new_password,
    re_new_password

  } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })


  const onSubmit = e => {
    e.preventDefault();    
    const uid = params.uid
    const token = params.token
    console.log(uid+'-'+token)
    if (new_password === re_new_password) {      
      reset_password_confirm(uid, token, new_password, re_new_password);
      setRequestSent(true)
    }
    if(requestSent && !loading){
      return <Navigate to="/" />
    }


  }
  return (
    <Layout>
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
            alt="Workflow"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">New password</h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={e => onSubmit(e)} className="space-y-6" action="#" method="POST">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    name="new_password"
                    value={new_password}
                    onChange={e => onChange(e)}
                    type="password"
                    placeholder="Password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Repeat Password
                </label>
                <div className="mt-1">
                  <input
                    name="re_new_password"
                    value={re_new_password}
                    onChange={e => onChange(e)}                    
                    type="password"
                    placeholder="Repeat new password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>


              <div>
                {loading ?
                  <button
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Oval
                      color="#fff"
                      height={40}
                      widht={40}>

                    </Oval>
                  </button> :
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Confirm Reset password
                  </button>}

              </div>
            </form>


          </div>
        </div>
      </div>
    </Layout>
  )
}

const mapStateToProps = state => ({
  loading: state.Auth.loading,

})

export default connect(mapStateToProps, {
  reset_password_confirm,
})(PasswordConfirm)
