# wowzob-backend

> Built with Nodejs, Express, Mongodb, Passport

## Quick Start
```bash
# Install dependencies
npm install or yarn
# Start mongodb
Install mongodb and run on your pc
# Start Dev Server
yarn run start:dev
```
## Server
Server runs on http://localhost:5000

## Validation
Server will validate all of the request

# REST API

The REST API to the example app is described below.

## Register 

### Request
    Post auth/register
        {
            username: '',
            email: '',
            password: ''
        }
### Response

    {
        success: 0 or 1
        message: Response server content,
        user: only when success = 1
    }

## Login 

### Request
    Post auth/login
        {
            email: '',
            password: ''
        }

### Response

    {
        success: 0 or 1
        message: Response server content,
        user: only when success = 1
    }

## Reset Password Request

### Request
    Post auth/password_reset_request
        {
            email: '',
        }

### Response

    {
        success: 0 or 1
        message: Response server content.
    }

## Reset Password

### Request
    Post auth/password_reset
        {
            selector: '',
            token: '',
            password: ''
        }

### Response

    {
        success: 0 or 1
        message: Response server content.
    }


## Profile Update

### Request
    Post auth/profile_update
        {
            email: '',
            username: ''
        }

### Response

    {
        success: 0 or 1
        message: Response server content.
    }

## Profile Password Update

### Request
    Post auth/password_profile_update
        {
            newpassword: '',
            oldpassword: ''
        }

### Response

    {
        success: 0 or 1
        message: Response server content.
    }

## Logout 

### Request

`Get auth/logout`

### Response

    {
        success: 0 or 1
        message: Response server content.
    }

## Check Session 

### Request

`Get auth/check_session`

### Response

    {
        success: 0 or 1
        message: Response server content.
    }

## Converter search

### Request
    Post converter/get_converters
        {
            make: '',
            model: '',
            identifier: '',
            activePage: '',

        }
### Response

    {
        success: 0 or 1
        message: Response server content.
        data:  array (only when success 1).
        total: number (only when success 1)
    }

## Converter models, makes, total

### Request
    Get converter/get_model_make_types
        {
        }
### Response

    {
        success: 0 or 1
        message: Response server content.
        data: {
            makes: array,
            models: array,
            total: number
        }
    }

## Converter Add

### Request
    Post converter/add_part
        {
            identifier: [], 
            price: '', 
            make: '', 
            model: '', 
            year: '', 
            notes: '', 
            images: []
        }
### Response

    {
        success: 0 or 1
        message: Response server content.
    }

## Converter Edit

### Request
    Post converter/edit_part
        {
            _id: '',
            identifier: [], 
            price: '', 
            make: '', 
            model: '', 
            year: '', 
            notes: '', 
            images: []
        }
### Response

    {
        success: 0 or 1
        message: Response server content.
    }