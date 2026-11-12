CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/dscal

$(BIN):
	mkdir -p $(BIN)

$(BIN)/dscal: dscal.c $(HDRS) | $(BIN)
	$(CC) dscal.c -o $(BIN)/dscal -lcublas

clean:
	rm -rf $(BIN)
