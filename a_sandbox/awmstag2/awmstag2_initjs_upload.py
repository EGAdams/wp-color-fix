import pexpect
import sys
import os

def ftp_upload(host, username, password, file_path, target_directory):
    try:
        # Start the FTP connection
        child = pexpect.spawn(f'ftp {host}', encoding='utf-8', timeout=30)
        child.logfile = sys.stdout

        # Login
        child.expect('Name .*: ')
        child.sendline(username)
        child.expect('Password:')
        child.sendline(password)

        # Change to binary mode
        child.expect('ftp> ')
        child.sendline('binary')

        # Change to passive mode
        child.expect('ftp> ')
        child.sendline('passive')


        # Change directory
        print ( "changing to target directory: " + target_directory )  
        child.expect('ftp> ')
        child.sendline(f'cd {target_directory}')
        
        print ( "checking current directory... " )
        child.expect('ftp> ')
        child.sendline('pwd')
        child.expect( 'ordpress' )

        # press enter
        child.sendline('')

        # Upload the file
        child.expect('ftp> ')
        child.sendline(f'put {file_path}')

        # Exit FTP
        child.expect('ftp> ')
        child.sendline('bye')

    except pexpect.EOF:
        print("Encountered an EOF error.")
    except pexpect.TIMEOUT:
        print("Encountered a timeout.")
    except Exception as e:
        print(f"An error occurred: {e}")

# Example usage
local_base = "/home/adamsl/MCBA-Wordpress/www/"
remote_base = "/floridascarwash.com/wp-content/plugins/MCBA-Wordpress/www/"
os.chdir( local_base )
ftp_upload('floridascarwash.com', 'awmstag2', 'z8nqm61V.E[XN2', "init.js", remote_base )

