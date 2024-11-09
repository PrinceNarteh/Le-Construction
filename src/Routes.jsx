import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Protected from "./hooks/Protected";
import FloorPlan from "./pages/arBoard/FloorPlan";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Login from "./pages/auth/Login";
import BidDetails from "./pages/biding/BidDetails";

import AddProductOrSevicesForm from "./components/forms/payments/AddProductOrSevicesForm";
import EstimateAndInvoiceForm from "./components/forms/payments/EstimateAndInvoiceForm";
import BusinessSettings from "./pages/Business-Settings/BusinessSettings";
import ArProject from "./pages/arBoard/ArProject";
import ArProjectDetails from "./pages/arBoard/ArProjectDetails";
import Notes from "./pages/arBoard/Notes";
// import Visualization from "./pages/arBoard/Visualization";
import NewPassword from "./pages/auth/NewPassword";
import Otp from "./pages/auth/Otp";
import Bids from "./pages/biding/Bids";
import Categories from "./pages/categories/Categories";
import Chat from "./pages/chats/Chat";
// import AddClient from "./pages/clients/AddClient";
import AllClients from "./pages/clients/AllClients";
// import ClientDetails from "./pages/clients/ClientDetails";
// import EditClient from "./pages/clients/EditClient";
// import AddCompany from "./pages/companies/AddCompany";
import AllCompanies from "./pages/companies/AllCompanies";
// import CompanyDetails from "./pages/companies/CompanyDetails";
// import EditCompany from "./pages/companies/EditCompany";
import UpdateAppCode from "./pages/companies/UpdateAppCode";
import Branding from "./pages/complete-profile/Branding";
import Profile from "./pages/complete-profile/Profile";
import Dashboard from "./pages/dashboard/Dashboard";
// import AddEmployee from "./pages/employees/AddEmployee";
import AllEmployees from "./pages/employees/AllEmployees";
// import EditEmployee from "./pages/employees/EditEmployee";
// import EmployeeDetails from "./pages/employees/EmployeeDetails";
import Wrapper from "./pages/floorplanner/wrapper";
import Galleries from "./pages/gallery/Galleries";
import GalleryDetails from "./pages/gallery/GalleryDetails";
import MainProfile from "./pages/main-profile/MainProfile";
import MapPage from "./pages/map/MapPage";
import Notification from "./pages/notifications/Notification";
import SocialMedia from "./pages/pages-socialmedia/SocialMedia";
import Website from "./pages/pages-socialmedia/Website";
import MakePayment from "./pages/payments/MakePayment";
import OutPayments from "./pages/payments/OutPayments";
import ReceivedPayments from "./pages/payments/ReceivedPayments";
import TransactionDetails from "./pages/payments/TransactionDetails";
import Transactions from "./pages/payments/Transactions";
import EditEstimate from "./pages/payments/estimate/EditEstimate";
import Estimate from "./pages/payments/estimate/Estimate";
import EstimateDetails from "./pages/payments/estimate/EstimateDetails";
import EditInvoice from "./pages/payments/invoice/EditInvoice";
import InvoiceDetails from "./pages/payments/invoice/InvoiceDetails";
import Invoices from "./pages/payments/invoice/Invoices";
import ProductAndServices from "./pages/payments/products-and-services/ProductAndServices";
import AddProject from "./pages/projects/AddProject";
import AllJobs from "./pages/projects/AllJobs";
import BidProjects from "./pages/projects/BidProjects";
import IncomingProjectDetails from "./pages/projects/IncomingProjectDetails";
import IncomingProjects from "./pages/projects/IncomingProjects";
import JobDetails from "./pages/projects/JobDetails";
import AllRoles from "./pages/roles/AllRoles";
import Settings from "./pages/settings/Settings";
import AddSubContractor from "./pages/sub-contractors/AddSubContractor";
import AllSubContractors from "./pages/sub-contractors/AllSubContractors";
import EditSubContactor from "./pages/sub-contractors/EditSubContactor";
import SubContractorDetails from "./pages/sub-contractors/SubContractorDetails";
import SubContractorsGroupDetails from "./pages/sub-contractors/SubContractorsGroupDetails";
import SubContractorsGroups from "./pages/sub-contractors/SubContractorsGroups";
import SubmissionDetails from "./pages/submissions/SubmissionDetails";
import Submissions from "./pages/submissions/Submissions";
import AddTask from "./pages/tasks/AddTask";
import AllTasks from "./pages/tasks/AllTasks";
import TaskDetails from "./pages/tasks/TaskDetails";
import TaskForBidingDetails from "./pages/tasks/TaskForBidingDetails";
import TasksForBid from "./pages/tasks/TasksForBid";
import ThirdParty from "./pages/third-party-and-config/ThirdParty";
import BuilderTracking from "./pages/tracking/BuilderTracking";
import BuilderTrackingDetails from "./pages/tracking/BuilderTrackingDetails";
import SubscriptionPage from "./pages/subscription/Subscription";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/new-password" element={<NewPassword />} />
        <Route path="/branding" element={<Branding />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/subscribe" element={<SubscriptionPage />} />

        <Route
          path="/floor"
          element={
            <Protected>
              <Wrapper />
            </Protected>
          }
        />

        <Route
          element={
            <Protected>
              <Layout />
            </Protected>
          }
        >
          <Route path="/" element={<Dashboard />} />

          {/* Employees */}
          <Route path="/employees" element={<AllEmployees />} />

          {/* Companies */}
          <Route path="/companies">
            <Route index element={<AllCompanies />} />
            <Route
              path="/companies/update-app-code"
              element={<UpdateAppCode />}
            />
          </Route>

          {/* Sub Contractors  */}
          <Route path="/sub-contractors" element={<AllSubContractors />} />
          <Route
            path="/sub-contractors/add-sub-contractor"
            element={<AddSubContractor />}
          />
          <Route
            path="/sub-contractors/:subContractorId"
            element={<SubContractorDetails />}
          />
          <Route
            path="/sub-contractors/:subContractorId/edit"
            element={<EditSubContactor />}
          />
          <Route
            path="/sub-contractors/groups"
            element={<SubContractorsGroups />}
          />
          <Route
            path="/sub-contractors/groups/:subContractorGroupId"
            element={<SubContractorsGroupDetails />}
          />

          {/* Jobs  */}
          <Route path="/projects" element={<AllJobs />}></Route>
          {/* <Route path="/jobs/add-project" element={<AddProject />} /> */}
          <Route path="/projects/:projectId" element={<JobDetails />} />

          <Route path="/bid-projects" element={<BidProjects />} />
          <Route path="/incoming-projects" element={<IncomingProjects />} />
          <Route
            path="/incoming-projects/incomingProjectId"
            element={<IncomingProjectDetails />}
          />

          {/* Sub Contractor */}
          {/* <Route path="/sub-contractors" element={<AllCompanies />} />
          <Route
            path="/sub-contractors/add-sub-contractor"
            element={<AddCompany />}
          />
          <Route
            path="/sub-contractors/:subContractorId"
            element={<CompanyDetails />}
          />
          <Route
            path="/sub-contractors/:subContractorId/edit"
            element={<EditCompany />}
          /> */}

          <Route path="/tasks" element={<AllTasks />} />
          <Route path="/tasks/add-task" element={<AddTask />} />
          <Route path="/tasks/:taskId" element={<TaskDetails />} />
          <Route path="/tasks/tasks-for-bid" element={<TasksForBid />} />
          <Route
            path="/tasks/tasks-for-bidid"
            element={<TaskForBidingDetails />}
          />
          <Route path="/tasks/bids" element={<Bids />} />
          <Route path="/tasks/bids/:bidId" element={<BidDetails />} />

          <Route path="/arboard/floor-plan" element={<FloorPlan />} />
          {/* <Route path="/arboard/visualization" element={<Visualization />} /> */}
          <Route path="/arboard/notes" element={<Notes />} />

          <Route path="/arboard" element={<ArProject />} />
          <Route path="/arboard/:arProjectId" element={<ArProjectDetails />} />

          <Route path="/builder-tracking" element={<BuilderTracking />} />
          <Route
            path="/builder-tracking/:builderTrackingId"
            element={<BuilderTrackingDetails />}
          />
          <Route path="/builder-tracking/map" element={<MapPage />} />

          <Route path="/clients" element={<AllClients />} />

          <Route path="/website" element={<Website />} />
          {/* <Route path="/website/social-media" element={<SocialMedia />} /> */}
          <Route path="/business-settings" element={<BusinessSettings />} />

          <Route path="/settings" element={<Settings />} />

          <Route path="/notification" element={<Notification />} />
          <Route path="/submissions" element={<Submissions />} />
          <Route
            path="/submissions/:submissionId"
            element={<SubmissionDetails />}
          />

          <Route path="/categories" element={<Categories />} />

          <Route path="/third-party" element={<ThirdParty />} />

          <Route path="/chats" element={<Chat />} />

          <Route path="/main-profile" element={<MainProfile />} />

          <Route path="/roles" element={<AllRoles />} />

          {/* Estimate */}
          <Route path="/payment" element={<MakePayment />} />
          <Route path="/payment/estimate" element={<Estimate />} />
          <Route
            path="/payment/estimate/add-estimate"
            element={<EstimateAndInvoiceForm />}
          />
          <Route
            path="/payment/estimate/:estimateId"
            element={<EstimateDetails />}
          />
          <Route
            path="/payment/estimate/:estimateId/edit"
            element={<EditEstimate />}
          />

          {/* Invoice */}
          <Route path="/payment/invoice" element={<Invoices />} />
          <Route
            path="/payment/invoice/add-invoice"
            element={<EstimateAndInvoiceForm />}
          />
          <Route
            path="/payment/invoice/:invoiceId"
            element={<InvoiceDetails />}
          />
          <Route
            path="/payment/invoice/:invoiceId/edit"
            element={<EditInvoice />}
          />

          <Route path="/payment/transactions" element={<Transactions />} />
          <Route
            path="/payment/transactions/:transactionId"
            element={<TransactionDetails />}
          />
          <Route
            path="/payment/received-payments"
            element={<ReceivedPayments />}
          />
          <Route path="/payment/out-payments" element={<OutPayments />} />

          {/* Products and Services */}
          <Route
            path="/payment/products-and-services"
            element={<ProductAndServices />}
          />
          <Route
            path="/payment/products-and-services/add-products-and-services"
            element={<AddProductOrSevicesForm />}
          />

          <Route path="/galleries" element={<Galleries />} />
          <Route path="/galleries/:galleryId" element={<GalleryDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;