from django.urls import path, include
from . import views
from oauth2_provider.views import AuthorizationView, TokenView

urlpatterns = [
    #Helpdesk
     #------------- API -----------------------
     path('api-test/', views.api_test, name='api_test'),
     path('api-load-mail/', views.api_load_mail, name='api_load_mail'),
     path('load-mail/', views.start_realtime_mail_tracking, name='start_realtime_mail_tracking'),
     path('load-info/', views.get_user_info, name='get_user_info'),
     #------------- API -----------------------

    #------------- Dashboard-----------------------
    path('dashboard/', views.Dashboard, name='Dashboard'),                                            #Ticket Page - Trang hiển thị yêu cầu
    path('data-dashboard/', views.load_dashboard_Json, name='load_dashboard_Json'),                   #Ticket data - hiển thị danh sách yêu cầu dạng json
    #------------- Dashboard-----------------------

    #------------- Ticket-----------------------
    path('danh-sach-yeu-cau/', views.load_Ticket, name='load_Ticket'),                                 #Ticket Page - Trang hiển thị yêu cầu
    path('danh-sach-data-ticket/', views.load_Ticket_Json, name='load_Ticket_Json'),                   #Ticket data - hiển thị danh sách yêu cầu dạng json
    path('cap-nhat-ticket-status/', views.Ticket_Status_Update, name='Ticket_Status_Update'),          #Ticket Update - chỉnh sửa yêu cầu
    path('cap-nhat-ticket-nguoi-ho-tro/', views.Ticket_Assign_Update, name='Ticket_Assign_Update'),    #Ticket Update - chỉnh sửa yêu cầu
    path('tao-yeu-cau/', views.Create_Ticket, name='Create_Ticket'),                                   #Ticket Create - Tạo yêu cầu
    path('xoa-yeu-cau/', views.delete_ticket, name='delete_ticket'),                                   #Ticket Delete - xóa yêu cầu
    path('chinh-sua-yeu-cau/', views.Update_Ticket, name='Update_Ticket'),                             #Ticket Update - chỉnh sửa yêu cầu
    path('data-update-ticket/', views.Data_Update_Ticket, name='Data_Update_Ticket'),                  #Ticket Update - chỉnh sửa yêu cầu
    path('upload-files/', views.upload_files, name='upload_files'),                                    #Ticket upload - upload file cho yêu cầu (giới hạn 10MB)
    #------------- Ticket-----------------------

    #------------- Ticket Detail-----------------------
    path('chi-tiet-yeu-cau/<int:ticketID>/<str:title>/', views.load_Ticket_Detail_Json, name='load_Ticket_Detail_Json'),                                 #Ticket Page - Trang hiển thị yêu cầu
    path('cap-nhat-comment-unread/<int:ticketID>/<str:title>/<str:ReadCommentID>', views.update_unread, name='update_unread'),                                 #Ticket Page - Trang hiển thị yêu cầu
    path('cap-nhat-all-comment-unread/', views.update_unread_all, name='update_unread_all'),                                 #Ticket Page - Trang hiển thị yêu cầu
    path('tao-binh-luan/', views.Create_Comment, name='Create_Comment'),                                 #Ticket data - hiển thị danh sách yêu cầu dạng json
    path('get-file-name/', views.Get_File_Name, name='Get_File_Name'),                                   #Ticket Update - chỉnh sửa yêu cầu
    path('cap-nhat-tinh-trang/', views.Update_Status_Ticket, name='Update_Status_Ticket'),               #Ticket Update - chỉnh sửa yêu cầu
    path('cap-nhat-chi-tiet-yeu-cau/', views.Update_Ticket_Desc, name='Update_Ticket_Desc'),             #Ticket Create - Tạo yêu cầu
    path('cap-nhat-binh-luan/', views.Update_Comment, name='Update_Comment'),                            #Ticket Delete - xóa yêu cầu
    #------------- Ticket Detail-----------------------

    #------------- Company-----------------------
    path('danh-sach-cong-ty/', views.load_company, name='load_company'),                                 #Company Page - Trang hiển thị công ty
    path('danh-sach-data-cong-ty/', views.load_Company_Json, name='load_Company_Json'),                  #Company data - hiển thị danh nhóm cầu dạng json
    path('cap-nhat-cong-ty/', views.Update_Company, name='Update_Company'),                              #Company Update - chỉnh sửa yêu cầu
    path('tao-cong-ty/', views.Create_Company, name='Create_Company'),                                   #Company Create - Tạo Công Ty
    path('xoa-cong-ty/', views.Delete_Company, name='Delete_Company'),                                   #Company Delete - xóa yêu cầu
    path('data-update-company/', views.Data_Update_Company, name='Data_Update_Company'),                 #Company Update - chỉnh sửa yêu cầu
    #------------- Company-----------------------

    #------------- Group-------------------------
    path('danh-sach-nhom/', views.load_group, name='load_group'),                                        #Group Page - Trang hiển thị nhóm
    path('danh-sach-data-nhom/', views.load_Group_Json, name='load_Company_Json'),                       #Group data - hiển thị danh sách nhóm dạng json
    path('cap-nhat-nhom/', views.Update_Group, name='Update_Group'),                                     #Group Update - chỉnh sửa Nhóm
    path('tao-nhom/', views.Create_Group, name='Create_Group'),                                          #Group Create - Tạo Nhóm
    path('xoa-nhom/', views.Delete_Group, name='Delete_Group'),                                          #Group Delete - xóa Nhóm
    path('data-update-group/', views.Data_Update_Group, name='Data_Update_Group'),                       #Group Update - chỉnh sửa Nhóm
    path('load-menu/', views.Load_Data_Menu, name='Load_Data_Menu'),                                    #Group Update - chỉnh sửa Nhóm
    #------------- Group-------------------------

    #------------- Attachment-------------------------
    path('danh-sach-attach-file/', views.load_attachment, name='load_attachment'),                       #Attachment Page - Trang hiển thị nhóm
    path('danh-sach-data-attach-file/', views.load_Attachment_Json, name='load_Attachment_Json'),        #Attachment data - hiển thị danh sách nhóm dạng json
    path('cap-nhat-attachment/', views.Update_Attachment, name='Update_Attachment'),                     #Attachment Update - chỉnh sửa Nhóm
    path('xoa-dinh-kem/', views.Delete_Company, name='Delete_Company'),                                  #Attachment Delete - xóa Nhóm
    path('data-update-attachment/', views.Data_Update_Attachment, name='Data_Update_Attachment'),        #Attachment Update - chỉnh sửa Nhóm
    #------------- Group-------------------------

    #------------- Assign-------------------------
    path('danh-sach-phan-cong/', views.load_assign, name='load_assign'),                                 #Assign Page - Trang hiển thị nhóm
    path('danh-sach-data-phan-cong/', views.load_Assign_Json, name='load_Assign_Json'),                  #Assign data - hiển thị danh sách nhóm dạng json
    path('tao-phan-cong/', views.Create_Assign, name='Create_Assign'),                                   #Assign Create - Tạo phân công
    path('cap-nhat-phan-cong/', views.Update_Assign, name='Update_Assign'),                              #Assign Update - chỉnh sửa Nhóm
    path('xoa-phan-cong/', views.Delete_Assign, name='Delete_Assign'),                                   #Assign Delete - xóa Nhóm
    path('user-autocomplete/', views.user_autocomplete, name='user_autocomplete'),
    #------------- Assign-------------------------

    #------------- User-------------------------
    path('danh-sach-nguoi-dung/', views.load_User, name='load_User'),                                   #Comment Page - Trang hiển thị nhóm
    path('danh-sach-data-nguoi-dung/', views.load_User_Json, name='load_User_Json'),                    #Comment data - hiển thị danh sách nhóm dạng json
    path('tao-nguoi-dung/', views.Create_User, name='Create_User'),                                     #User Create - Tạo phân công
    path('cap-nhat-nguoi-dung/', views.Update_User, name='Update_User'),                                #User Update - chỉnh sửa Nhóm
    path('xoa-nguoi-dung/', views.Delete_User, name='Delete_User'),                                     #User Delete - xóa Nhóm
    path('data-update-user/', views.Data_Update_User, name='Data_Update_User'),                         #User Update - chỉnh sửa Nhóm
    path('kiem-tra-email/', views.Check_Email, name='Check_Email'),
    #------------- User-------------------------

    #------------- Comment-------------------------
    path('danh-sach-binh-luan/', views.load_comment, name='load_comment'),                                #User Page - Trang hiển thị nhóm
    path('danh-sach-data-binh-luan/', views.load_Comment_Json, name='load_Comment_Json'),                 #User data - hiển thị danh sách nhóm dạng json
    path('cap-nhat-binh-luan/', views.Update_Comment, name='Update_Comment'),                             #User Update - chỉnh sửa Nhóm
    path('data-update-comment/', views.Data_Update_Comment, name='Data_Update_Comment'),                  #User Update - chỉnh sửa Nhóm
    path('data-update-comment-desc/', views.Update_Comment_Desc, name='Update_Comment_Desc'),             #User Update - chỉnh sửa Nhóm
    #------------- Comment-------------------------

    #------------- Group Role-------------------------
    path('danh-sach-nhom-quyen/', views.load_group_role, name='load_group_role'),                        #GroupRole Page - Trang hiển thị nhóm
    path('danh-sach-data-nhom-quyen/', views.load_Group_Role_Json, name='load_Group_Role_Json'),         #GroupRole data - hiển thị danh sách nhóm dạng json
    path('tao-nhom-quyen/', views.Create_Group_Role, name='Create_Group_Role'),                          #GroupRole Create - Tạo Nhóm
    path('xoa-nhom-quyen/', views.Delete_Group_Role, name='Delete_Group_Role'),                          #GroupRole Delete - xóa Nhóm
    path('data-update-group-role/', views.Data_Update_Group_Role, name='Data_Update_Group_Role'),        #GroupRole Update - chỉnh sửa Nhóm
    path('cap-nhat-nhom-quyen/', views.Update_Group_Role, name='Update_Group_Role'),                     #GroupRole Update - chỉnh sửa Nhóm
    #------------- Group Role-------------------------

    #------------- Role-------------------------
    path('danh-sach-quyen/', views.load_role, name='load_role'),                                         #Role Page - Trang hiển thị nhóm
    path('danh-sach-data-quyen/', views.load_Role_Json, name='load_Role_Json'),                          #Role data - hiển thị danh sách nhóm dạng json
    path('tao-quyen/', views.Create_Role, name='Create_Role'),                                           #Role Create - Tạo Nhóm
    path('xoa-quyen/', views.Delete_Role, name='Delete_Role'),                                           #Role Delete - xóa Nhóm
    path('data-update-role/', views.Data_Update_Role, name='Data_Update_Role'),                          #Role Update - chỉnh sửa Nhóm
    path('cap-nhat-quyen/', views.Update_Role, name='Update_Role'),                                      #Role Update - chỉnh sửa Nhóm
    #------------- Role-------------------------

    #------------- Authorize -------------------------
    path('danh-sach-phan-quyen/', views.load_authorize, name='load_authorize'),                             #authorize Page - Trang hiển thị nhóm
    path('danh-sach-data-phan-quyen/', views.load_Authorize_Json, name='load_Authorize_Json'),              #authorize data - hiển thị danh sách nhóm dạng json
    path('phan-quyen-nguoi-dung/', views.Create_Authorize, name='Create_Authorize'),                        #authorize Create - Tạo Nhóm
    # path('xoa-quyen/', views.Delete_Role, name='Delete_Role'),                                            #authorize Delete - xóa Nhóm
    # path('data-update-role/', views.Data_Update_Role, name='Data_Update_Role'),                           #authorize Update - chỉnh sửa Nhóm
    # path('cap-nhat-quyen/', views.Update_Role, name='Update_Role'),                                       #authorize Update - chỉnh sửa Nhóm
    path('role-data-user/', views.load_Authorize_data, name='load_Authorize_data'),                         #authorize Page - Trang hiển thị nhóm
    path('menu-data/', views.role_menu, name='role_menu'),
    #------------- Authorize -------------------------

    #------------- Authorize Role -------------------------
    path('phan-quyen-user/', views.Auth_Role_User, name='Auth_Role_User'),
    path('role-user/', views.check_user, name='check_user'),
    path('phan-quyen-attach/', views.Auth_Role_Attach, name='Auth_Role_Attach'),
    path('role-attach/', views.check_attach, name='check_attach'),
    path('phan-quyen-ticket/', views.Auth_Role_Ticket, name='Auth_Role_Ticket'),
    path('role-ticket/', views.check_ticket, name='check_ticket'),
    path('phan-quyen-binh-luan/', views.Auth_Role_Comment, name='Auth_Role_Comment'),
    path('role-binh-luan/', views.check_comment, name='check_comment'),
    path('phan-quyen-cong-ty/', views.Auth_Role_Company, name='Auth_Role_Company'),
    path('role-cong-ty/', views.check_company, name='check_company'),
    path('phan-quyen-nhom/', views.Auth_Role_Group, name='Auth_Role_Group'),
    path('role-nhom/', views.check_group, name='check_group'),
    path('phan-quyen-phan-cong/', views.Auth_Role_Assign, name='Auth_Role_Assign'),
    path('role-phan-cong/', views.check_assign, name='check_assign'),
    path('phan-quyen-nhom-quyen/', views.Auth_Role_GroupRole, name='Auth_Role_GroupRole'),
    path('role-nhom-quyen/', views.check_grouprole, name='check_grouprole'),
    path('phan-quyen-quyen/', views.Auth_Role, name='Auth_Role'),
    path('role-quyen/', views.check_role, name='check_role'),
    path('phan-quyen-authorize/', views.Auth_Authorize, name='Auth_Authorize'),
    path('role-authorize/', views.check_authorize, name='check_authorize'),
    #------------- Authorize Role -------------------------

    #------------- Office 365 Automation -------------------------
    # path('test-mail1/', views.check_emails, name='check_emails'),
    path('load-mail-unread/', views.call_graph_api, name='call_graph_api'),
    path('get-code/', views.get_authorization_code, name='get_authorization_code'),
    path('read-mail/<str:email_id>/', views.read_email, name='read_email'),
    #------------- Office 365 Automation -------------------------

    #------------- Function-----------------------
    path('logout/', views.logout, name='logout'),                                                       #Logot Page - đăng xuất
    path('setcookie/', views.SetCookie),                                                                #Function set cookie - lưu cookie
    path('getcookie/', views.GetCookie),                                                                #Function get cookie - lấy cookie                   
    path('deletecookie/', views.DeleteCookie),                                                          #Function delete cookie - xóa cookie

    path('send-mail/', views.send_email, name='send_email'),
    path('load-read-comment/', views.read_comment, name='read_comment'),
    #------------- Ticket-----------------------

    #------------- Login------------------------
    # path('login/', views.Login_page, name='login'),
    path('', views.Login_function, name='login'),                                                       #Login Page - trang đăng nhập
    path('system/callback/', views.login_system, name='login_system'),                                  #Function call back login - trang kiểm tra xác thực đăng nhập
    path('login/callback/', views.microsoft_login_token, name='login_callback'),                        #Login Microsoft - trang đăng nhập Microsoft
    path('google/callback/', views.google_login, name='google_login'),                                  #Login google - trang đăng nhập google
    path('facebook/callback/', views.facebook_login, name='facebook_login'),                            #Login facebook - trang đăng nhập facebook
    #------------- Login------------------------





    #------------- other------------------------
    path('Admin/', views.Admin, name='Admin'),
    path('trang-chu/', views.Home, name='Home'),
    # path('danh-sach-du-lieu/', views.Page_data, name='DataList'),
    path('danh-sach-san-pham/', views.Product_data, name='Product'), 
    path('danh-sach-test/', views.load_Product, name='test'),
    path('danh-sach-test1/', views.load_data, name='load_data'),
    
    path('delete-product/', views.delete_Product, name='delete_Product'),
    path('data-category/', views.Data_Category, name='Data_Category'),
    path('add_product/', views.add_product, name='add_product'),
    path('load-data-update-product/', views.Data_Update_Product, name='Data_Update_Product'),
    path('update-product/', views.update_product, name='update_product'),
    #------------- otther------------------------
    
    path('trang-chu-new/', views.Trangchu, name='Trangchu'),

]