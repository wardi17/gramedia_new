USE [um_db]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author      : WARDI
-- Create date : 1-10-2025
-- Description : INSERT master_gramed_partid
-- =============================================
CREATE PROCEDURE USP_SimpanDataMastergramedPartid
    @partid_gramedia VARCHAR(50),
    @part_id_bambi VARCHAR(50),
    @partname_bambi VARCHAR(400)
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (
    SELECT 1 
    FROM [um_db].[dbo].master_gramed_partid 
    WHERE partid_gramedia = @partid_gramedia
)
BEGIN
    UPDATE [um_db].[dbo].master_gramed_partid
    SET partid_bambi= @part_id_bambi,
        partname_bambi = @partname_bambi
    WHERE partid_gramedia = @partid_gramedia
END
ELSE
BEGIN
    INSERT INTO [um_db].[dbo].master_gramed_partid
        (partid_gramedia, partid_bambi, partname_bambi)
    VALUES
        (@partid_gramedia,@part_id_bambi,@partname_bambi)
END

  END

  GO
  EXEC USP_SimpanDataMastergramedPartid '1224345', '1010-01', 'PVC LAF F/C 75mm 7cm Blue1010-01.SM'