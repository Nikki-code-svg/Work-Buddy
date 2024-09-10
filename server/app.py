#!/usr/bin/env python3

# Standard library imports

# Remote library imports
import os
import imghdr
import uuid
from flask import Flask, request, session, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash
from models import User, JobSite, Material, Image, Prints, PunchList
from config import app, db, bcrypt 
from datetime import datetime
from flask import Flask, request, jsonify
import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
import logging
from flask import send_file
import io

# from PIL import Image
# import io

# Local imports

# Add your model imports
# Cloudinary configuration



# Views go here!

# def validate_image(stream):
#     header = stream.read(512) #reading the first 512 bytes of the image file to tell what type of image type.
#     stream.seek(0)
#     format = imghdr.what(None, header)
#     if not format:
#         return None
#     return "." + (format if format != "jpeg" else "jpg")

@app.route('/')
def index():
    return '<h1>Work Buddy</h1>'


# START USERS/CHECK

@app.post('/api/users')
def create_user():
    data = request.json
    try:
        new_user = User(username=data['username'])
        new_user.password = data['password']  # Ensure password hashing here
        db.session.add(new_user)
        db.session.commit()
        session['user_id'] = new_user.id 
        return new_user.to_dict(), 201
    except Exception as e:
        db.session.rollback()  # Rollback transaction on error
        return { 'error': str(e) }, 406

@app.get('/api/check_session')
def check_session():
    user_id = session.get('user_id')

    if user_id:
        user = User.query.where(User.id == user_id).first()
        return user.to_dict(), 200
    else:
        return {}, 204


@app.post('/api/login')
def login():
    data = request.json 
    user = User.query.where(User.username == data['username']).first()
    if user and user.authenticate(data['password']):
        session['user_id'] = user.id 
        return user.to_dict(), 201
    else:
        return { 'error': 'Invalid username or password' }, 401

@app.delete('/api/logout')
def logout():
    session.pop('user_id')
    return {}, 204

#END USERS/CHECK

# START OF JOBSITE

# READ
@app.get('/api/jobsites')
def all_jobsites():

    jobsite_list = JobSite.query.all()
    jobsite_dict = [ jobsite.to_dict() for jobsite in jobsite_list ]

    return jobsite_dict, 200

# READ BY ID
@app.get('/api/jobsites/<int:id>')
def get_jobsite(id):
    found_jobsite = JobSite.query.where(JobSite.id == id).first()

    if found_jobsite:
        return found_jobsite.to_dict(), 200
    else:
        return jsonify({ "message": "Jobsite not found" }), 404
    
# POST
@app.post('/api/jobsites')
def create_jobsite():
    data = request.json

    # Parse datetime fields
    existing_jobsite = JobSite.query.filter_by(
        name=data['name'],
        location=data['location'],
        startdate=data['startdate'],
        enddate=data['enddate'],
        note=data['note']
       
    ).first()

    if existing_jobsite:
        return jsonify({"message": "Jobsite already exists"}), 400

    new_jobsite = JobSite(
        name=data['name'],
        location=data['location'],
        startdate=data['startdate'],
        enddate=data['enddate'],
        note=data.get('note')
       
    )

    try:
        db.session.add(new_jobsite)
        db.session.commit()

        return new_jobsite.to_dict(), 201

    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 400

# PATCH 
@app.patch('/api/jobsites/<int:id>')
def update_jobsite(id):
    found_jobsite = JobSite.query.where(JobSite.id == id).first()

    if found_jobsite:
        data = request.json

        try:
            for key in data:
                if hasattr(found_jobsite, key):  
                    setattr(found_jobsite, key, data[key])
                else:
                    return {"error": f"Invalid field: {key}"}, 400

            db.session.add(found_jobsite)
            db.session.commit()

            return found_jobsite.to_dict(), 202

        except Exception as e:
            
            print(f"Error updating jobsite: {e}")
            return {"error": "An error occurred while updating the jobsite"}, 400

    else:
        return {"error": "Could not find JobSite"}, 404


# DELETE
@app.delete('/api/jobsites/<int:id>')
def delete_jobsite_by_id(id):

    found_jobsite = JobSite.query.filter_by(id=id).first()

    if found_jobsite:
        db.session.delete(found_jobsite)
        db.session.commit()
        return {}, 204
    else:
        return { 'error': "Not Found" }, 404
# END OF JOBSITE


# START OF MATERIAL
# READ
@app.get('/api/jobsites/<int:jobsite_id>/materials')
def get_materials_by_jobsite(jobsite_id):

    materials = Material.query.filter_by(jobsite_id=jobsite_id).all()
    material_dict = [material.to_dict() for material in materials]
    return material_dict, 200


# READ BY ID
@app.get('/api/materials/<int:id>')
def get_material(id):

    found_material = Material.query.where(Material.id == id).first()

    if found_material:
        return found_material.to_dict(), 200
    else:
        return { "error": "Not Found" }, 404
    
# POST
@app.post('/api/jobsites/<int:jobsite_id>/materials')
def create_material(jobsite_id):

    data = request.get_json()

    try:
        datelist = data['datelist']
        content = data['content']
        new_material = Material(datelist=datelist, content=content, jobsite_id=jobsite_id)
        db.session.add(new_material)
        db.session.commit()
        return jsonify(new_material.to_dict()), 201
    except KeyError as e:
        return jsonify({'error': f'Missing key: {e}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 400

   # PATCH
@app.patch('/api/jobsites/<int:jobsite_id>/materials/<int:id>')
def update_material(jobsite_id, id):

    found_material = Material.query.filter_by(id=id, jobsite_id=jobsite_id).first()

    if found_material:
        data = request.get_json()
        try:
            for key in data:
                setattr(found_material, key, data[key])
            db.session.commit()
            return found_material.to_dict(), 202
        except Exception as e:
            return {'error': str(e)}, 400
    else:
        return {'error': 'Material not found for this job site'}, 404

    
# DELETE
@app.delete('/api/jobsites/<int:jobsite_id>/materials/<int:id>')
def delete_material(jobsite_id, id):

    found_material = Material.query.filter_by(id=id, jobsite_id=jobsite_id).first()

    if found_material:
        db.session.delete(found_material)
        db.session.commit()
        return {}, 204
    else:
        return {'error': 'Material not found for this job site'}, 404


# END OF MATERIAL


# START OF PRINTS
# # READ

@app.get('/api/jobsites/<int:jobsite_id>/prints')
def get_prints(jobsite_id):

    print(f"Fetching prints for jobsite_id: {jobsite_id}")  # Debugging line
    prints = Prints.query.filter_by(jobsite_id=jobsite_id).all()
    print(f"Found prints: {prints}")  # Debugging line
    if prints:
        return jsonify([print.to_dict() for print in prints]), 200
    return jsonify([]), 200


# READ BY ID
@app.get('/api/jobsites/<int:jobsite_id>/prints/<int:id>')
def get_print(jobsite_id, id):

    found_print = Prints.query.filter_by(id=id, jobsite_id=jobsite_id).first()
    if found_print:
        return found_print.to_dict(), 200
    else:
        return { "error": "Not found" }, 404


# POST

@app.post('/api/jobsites/<int:jobsite_id>/prints')
def create_print(jobsite_id):
    data = request.get_json()
    
    logging.debug(f"Received data: {data}")

    try:
        # Ensure 'url' is provided in the request data
        if 'url' not in data:
            raise KeyError('url')
        
        url = data['url']

        # Upload the image to Cloudinary
        try:
            upload_result = cloudinary.uploader.upload(url)  # Upload image to Cloudinary
        except Exception as e:
            logging.error(f"Cloudinary upload failed: {e}")
            return jsonify({'error': 'Image upload failed. Please try again.'}), 500

        # Extract the secure URL from Cloudinary response
        cloudinary_url = upload_result['secure_url']
        
        # Save the Cloudinary URL to your database
        new_print = Prints(url=cloudinary_url, jobsite_id=jobsite_id)
        db.session.add(new_print)
        db.session.commit()
        
        logging.info(f"Print created: {new_print.to_dict()}")
        return jsonify(new_print.to_dict()), 201

    except KeyError as e:
        logging.error(f"Missing key: {e}")
        return jsonify({'error': f'Missing key: {e}'}), 400

    except Exception as e:
        logging.error(f"Error creating print: {str(e)}")
        return jsonify({'error': str(e)}), 500



# DELETE

@app.delete('/api/jobsites/<int:jobsite_id>/prints/<int:id>')
def delete_prints(jobsite_id, id):

    found_prints = Prints.query.filter_by(id=id, jobsite_id=jobsite_id).first()

    if found_prints:
        db.session.delete(found_prints)
        db.session.commit()
        return {}, 204
    else:
        return {'error': 'Material not found for this job site'}, 404


# END OF PRINTS

# START OF PUNCHLIST
# READ
@app.get('/api/jobsites/<int:jobsite_id>/punchlists')
def all_punchlists(jobsite_id):

     punchlist_list = PunchList.query.filter_by(jobsite_id=jobsite_id).all()
     punchlist_dict = [ punchlist.to_dict() for punchlist in punchlist_list ]

     return punchlist_dict, 200

# READ BY ID
@app.get('/api/punchlists/<int:id>')
def get_punchlist(id):
    found_punchlist = PunchList.query.where(PunchList.id == id).first()

    if found_punchlist:
        return found_punchlist.to_dict(), 200
    else:
        return {"error": "Not found"}, 404
    
# POST
@app.post('/api/jobsites/<int:jobsite_id>/punchlists')
def create_punchlist(jobsite_id):

    data = request.get_json()

    try:
        name = data['name']
        new_punchlist = PunchList( name=name,  jobsite_id=jobsite_id)
        db.session.add(new_punchlist)
        db.session.commit()
        return jsonify(new_punchlist.to_dict()), 201
    except KeyError as e:
        return jsonify({'error': f'Missing key: {e}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
# PATCH
@app.patch('/api/jobsites/<int:jobsite_id>/punchlists/<int:id>')
def update_punchlist(jobsite_id, id):

    found_punchlist = PunchList.query.filter_by(id=id,  jobsite_id=jobsite_id).first()

    if  found_punchlist:
        data = request.get_json()
        try:
            for key in data:
                setattr( found_punchlist, key, data[key])
            db.session.commit()
            return  found_punchlist.to_dict(), 202
        except Exception as e:
            return {'error': str(e)}, 400
    else:
        return {'error': 'Material not found for this job site'}, 404
    
    
# DELETE
@app.delete('/api/jobsites/<int:jobsite_id>/punchlists/<int:id>')
def delete_punchlist(jobsite_id, id):

    found_punchlist = PunchList.query.filter_by(id=id, jobsite_id=jobsite_id).first()

    if found_punchlist:
        db.session.delete(found_punchlist)
        db.session.commit()
        return {}, 204
    else:
        return {'error': 'Material not found for this job site'}, 404

# END OF PUNCHLIST

# START OF IMAGES
# READ
@app.get('/api/jobsites/<int:id>/images')
def get_jobsite_images(id):

    try:
        images = Image.query.filter_by(jobsite_id=id).all()
        image_dicts = [image.to_dict() for image in images]
        return image_dicts, 200
    except Exception as e:
        return {'error': str(e)}, 500

# READ BY ID
@app.get('/api/jobsite/<int:jobsite_id>/images/<int:id>')
def get_image(jobsite_id, id):
    
    try:
        found_image = Image.query.filter_by(id=id, jobsite_id=jobsite_id).first()
        if found_image:
            return found_image.to_dict(), 200
        else:
            return {'error': "Not Found"}, 404
    except Exception as e:
        return {'error': str(e)}, 500
    





# @app.get('/api/jobsite/<int:jobsite_id>/images/<int:id>')
# def get_image(jobsite_id, id):
#     try:
#         found_image = Image.query.filter_by(id=id, jobsite_id=jobsite_id).first()
#         if found_image:
#             image_data = io.BytesIO(found_image.image_data)  # Assuming 'image_data' is a BLOB field
#             return send_file(image_data, mimetype='image/jpeg')  # Adjust mimetype as needed
#         else:
#             return {'error': "Not Found"}, 404
#     except Exception as e:
#         return {'error': str(e)}, 500


    
# POST
@app.post('/api/jobsites/<int:jobsite_id>/images')
def create_image(jobsite_id): 
    data = request.json

    try:
        new_image = Image(location=data['location'], note=data['note'], url=data['url'], jobsite_id=jobsite_id)
        db.session.add(new_image)
        db.session.commit()

        return new_image.to_dict(), 201
    
    except Exception as e:
        return {'error': str(e)}, 400

    
  
    
# PATCH
@app.patch('/api/jobsites/<int:jobsite_id>/images/<int:id>')
def update_image(jobsite_id, id):
    found_image = Image.query.filter_by(id=id, jobsite_id=jobsite_id).first()

    if found_image:
        data = request.json

    try:
        for key in data:
            setattr(found_image, key, data[key])
            db.session.add(found_image)
            db.session.commit()

            return found_image.to_dict(), 202
        
    except Exception as e:
        return { 'error': str(e)}, 400
    

    
# DELETE
@app.delete('/api/jobsites/<int:jobsite_id>/images/<int:id>')
def delete_image(jobsite_id, id):
    found_image = Image.query.filter_by(id=id, jobsite_id=jobsite_id).first()
    if found_image:
        db.session.delete(found_image)
        db.session.commit()

        return {}, 204
    
    else:
        return {'error': 'Not Found'}, 404
    

# END OF IMAGES

# @app.post('/upload')
# def upload():
#     pass
   


if __name__ == '__main__':
    app.run(port=5555, debug=True)

